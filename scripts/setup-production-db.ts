#!/usr/bin/env tsx
/**
 * Production Database Setup Script
 * 
 * This script sets up a PostgreSQL database for production:
 * 1. Checks DATABASE_URL is set and points to PostgreSQL
 * 2. Generates Prisma client
 * 3. Runs migrations
 * 4. Verifies connection
 * 5. Optionally seeds initial data
 * 
 * Usage:
 *   DATABASE_URL="postgresql://..." npm run setup:production-db
 *   or
 *   npm run setup:production-db -- --database-url="postgresql://..."
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the root directory (where package.json is)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Load .env from root directory, then try server directory as fallback
const rootEnvPath = resolve(rootDir, '.env');
const serverEnvPath = resolve(rootDir, 'server', '.env');

// Try to load .env files
let envResult = config({ path: rootEnvPath });
if (envResult.error || !envResult.parsed || Object.keys(envResult.parsed || {}).length === 0) {
  // Try server directory as fallback
  envResult = config({ path: serverEnvPath });
}

// If dotenv didn't work, try reading the file directly
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  for (const envPath of [rootEnvPath, serverEnvPath]) {
    if (existsSync(envPath)) {
      try {
        const envContent = readFileSync(envPath, 'utf-8');
        const dbUrlMatch = envContent.match(/^DATABASE_URL\s*=\s*["']?([^"'\n]+)["']?/m);
        if (dbUrlMatch && dbUrlMatch[1]) {
          process.env.DATABASE_URL = dbUrlMatch[1];
          console.log(`📋 Loaded DATABASE_URL from ${envPath}`);
          break;
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  }
}

const args = process.argv.slice(2);
const dbUrlArg = args.find((a) => a.startsWith('--database-url='));
let dbUrl = dbUrlArg ? dbUrlArg.split('=')[1] : process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL is not set.');
  console.error(`   Checked .env files in:`);
  console.error(`     - ${rootEnvPath}`);
  console.error(`     - ${serverEnvPath}`);
  console.error('   Set it in .env or pass --database-url="postgresql://..."');
  process.exit(1);
}

// Remove quotes if present (Windows .env files sometimes have quotes)
let cleanDbUrl = String(dbUrl).replace(/^["']|["']$/g, '').trim();

if (!cleanDbUrl.startsWith('postgresql://') && !cleanDbUrl.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL must point to PostgreSQL (postgresql://...)');
  console.error(`   Current value: ${cleanDbUrl.substring(0, 50)}...`);
  console.error(`   Raw value: ${String(dbUrl).substring(0, 50)}...`);
  console.error(`   (Checked: ${rootEnvPath} and ${serverEnvPath})`);
  console.error('\n💡 Tip: Make sure DATABASE_URL in .env starts with postgresql://');
  console.error('   Example: DATABASE_URL="postgresql://user:pass@host:5432/db"');
  process.exit(1);
}

// For Supabase: use pooler on port 5432 if available (works for migrations)
// Only port 6543 (transaction pooler) has issues with Prisma
let migrationDbUrl = cleanDbUrl;

if (cleanDbUrl.includes(':6543')) {
  console.warn('⚠️  Warning: Detected Supabase transaction pooler (port 6543)');
  console.warn('   Converting to session pooler (port 5432) for migrations...');
  migrationDbUrl = cleanDbUrl.replace(':6543', ':5432');
  console.log(`   Using: ${migrationDbUrl.substring(0, 60)}...\n`);
} else if (cleanDbUrl.includes('pooler.supabase.com') && !cleanDbUrl.includes(':5432')) {
  // Pooler without explicit port, add 5432
  if (!cleanDbUrl.match(/:\d+\//)) {
    migrationDbUrl = cleanDbUrl.replace('pooler.supabase.com', 'pooler.supabase.com:5432');
    console.log(`📋 Using pooler on port 5432 for migrations\n`);
  }
}

console.log('🚀 Setting up production database...\n');
console.log(`📋 Using DATABASE_URL: ${cleanDbUrl.substring(0, 30)}...\n`);

// Step 1: Generate Prisma Client
console.log('📦 Step 1: Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Prisma Client generated\n');
} catch (e) {
  console.error('❌ Failed to generate Prisma Client');
  process.exit(1);
}

// Step 2: Check migration status first
console.log('🗄️  Step 2: Checking migration status...');
try {
  // Ensure we're in root directory and schema is found
  const schemaPath = resolve(rootDir, 'prisma', 'schema.prisma');
  if (!existsSync(schemaPath)) {
    throw new Error(`Prisma schema not found at ${schemaPath}`);
  }
  
  const statusOutput = execSync('npx prisma migrate status', { 
    encoding: 'utf-8',
    env: { ...process.env, DATABASE_URL: migrationDbUrl },
    cwd: rootDir, // CRITICAL: must be rootDir, not server/
    timeout: 30000, // 30 second timeout
  });
  
  if (statusOutput.includes('Database schema is up to date')) {
    console.log('✅ Database schema is already up to date\n');
  } else if (statusOutput.includes('migrations found') || statusOutput.includes('not yet been applied')) {
    console.log('📦 Running pending migrations...');
    console.log('   (This may take a moment...)');
    
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit', 
        env: { ...process.env, DATABASE_URL: migrationDbUrl },
        cwd: rootDir, // CRITICAL: must be rootDir
        timeout: 120000, // 2 minute timeout for migrations
      });
      console.log('✅ Migrations completed\n');
    } catch (migrateError: any) {
      const migrateOutput = migrateError.stdout || migrateError.stderr || migrateError.message || '';
      
      if (migrateOutput.includes('advisory lock') || migrateOutput.includes('P1002') || migrateOutput.includes('timed out trying to acquire')) {
        console.error('\n❌ Migration failed: Connection pooler does not support Prisma migrations');
        console.error('\n💡 Solution: Use direct connection string (not pooler)');
        console.error('   1. Go to Supabase Dashboard → Settings → Database');
        console.error('   2. Copy "Connection string" → "URI" mode (NOT Session/Transaction mode)');
        console.error('   3. It should look like: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres');
        console.error('   4. Update DATABASE_URL in .env and run again');
        console.error('\n   OR run migrations on Fly.io:');
        console.error('   fly ssh console -C "cd /app && npm run db:migrate"');
        console.error('\n   See MIGRATION_FIX.md for detailed instructions');
        process.exit(1);
      }
      throw migrateError;
    }
  } else {
    console.log('⚠️  Migration status unclear, attempting deploy...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit', 
      env: { ...process.env, DATABASE_URL: migrationDbUrl },
      cwd: rootDir, // CRITICAL: must be rootDir
      timeout: 120000,
    });
    console.log('✅ Migrations completed\n');
  }
} catch (e: any) {
  const errorOutput = (e.stdout || e.stderr || e.message || '').toString();
  
  // migrate status returns exit code 1 when migrations are pending - this is normal!
  if (e.status === 1 && (errorOutput.includes('not yet been applied') || errorOutput.includes('migrations found'))) {
    // This is expected - migrations need to be applied
    console.log('📦 Pending migrations detected, deploying...');
    console.log('   (This may take a moment...)');
    
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit', 
        env: { ...process.env, DATABASE_URL: migrationDbUrl },
        cwd: rootDir,
        timeout: 120000,
      });
      console.log('✅ Migrations completed\n');
    } catch (migrateError: any) {
      const migrateOutput = (migrateError.stdout || migrateError.stderr || migrateError.message || '').toString();
      
      if (migrateOutput.includes('advisory lock') || migrateOutput.includes('P1002') || migrateOutput.includes('timed out trying to acquire')) {
        console.error('\n❌ Migration failed: Connection pooler does not support Prisma migrations');
        console.error('\n💡 Solution: Use direct connection string (not pooler)');
        console.error('   1. Go to Supabase Dashboard → Settings → Database');
        console.error('   2. Copy "Connection string" → "URI" mode (NOT Session/Transaction mode)');
        console.error('   3. It should look like: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres');
        console.error('   4. Update DATABASE_URL in .env and run again');
        console.error('\n   OR run migrations on Fly.io:');
        console.error('   fly ssh console -C "cd /app && npm run db:migrate"');
        console.error('\n   See MIGRATION_FIX.md for detailed instructions');
        process.exit(1);
      }
      throw migrateError;
    }
  } else if (errorOutput.includes('advisory lock') || errorOutput.includes('P1002') || errorOutput.includes('timed out trying to acquire')) {
    console.error('\n❌ Migration failed: Connection pooler does not support Prisma migrations');
    console.error('\n💡 Solution: Use direct connection string (not pooler)');
    console.error('   1. Go to Supabase Dashboard → Settings → Database');
    console.error('   2. Copy "Connection string" → "URI" mode (NOT Session/Transaction mode)');
    console.error('   3. It should look like: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres');
    console.error('   4. Update DATABASE_URL in .env and run again');
    console.error('\n   OR run migrations on Fly.io:');
    console.error('   fly ssh console -C "cd /app && npm run db:migrate"');
    console.error('\n   See MIGRATION_FIX.md for detailed instructions');
    process.exit(1);
  } else if (e.signal === 'SIGTERM' || errorOutput.includes('timeout')) {
    console.error('❌ Migration timed out - database may be unreachable');
    console.error('   Check your DATABASE_URL and network connection');
  } else if (e.status === 1 && (e.stdout?.includes('up to date') || errorOutput.includes('up to date'))) {
    console.log('✅ Database schema is already up to date\n');
  } else if (errorOutput.includes('Could not find Prisma Schema')) {
    console.error('❌ Prisma schema not found');
    console.error(`   Expected at: ${resolve(rootDir, 'prisma', 'schema.prisma')}`);
    console.error('   Make sure you run this script from the project root');
    process.exit(1);
  } else {
    console.error('❌ Failed to check migration status');
    if (e.stdout) {
      console.error('   Output:', e.stdout.toString().substring(0, 500));
    }
    if (e.stderr) {
      console.error('   Error:', e.stderr.toString().substring(0, 500));
    }
    console.error('   Full error:', errorOutput.substring(0, 500));
    process.exit(1);
  }
}

// Step 3: Verify connection
console.log('🔍 Step 3: Verifying database connection...');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: cleanDbUrl,
    },
  },
});

try {
  // Set connection timeout
  await Promise.race([
    prisma.$connect(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
    )
  ]);
  
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  
  console.log('✅ Database connection verified');
  console.log(`   Users: ${userCount}`);
  console.log(`   Products: ${productCount}`);
  console.log(`   Orders: ${orderCount}\n`);
} catch (e: any) {
  console.error('❌ Failed to connect to database');
  if (e.message?.includes('timeout')) {
    console.error('   Connection timed out - check your DATABASE_URL and network');
  } else if (e.message?.includes("Can't reach database server")) {
    console.error('   Database server is not reachable');
    console.error('   Check:');
    console.error('     - Database is running');
    console.error('     - Firewall allows connections');
    console.error('     - DATABASE_URL is correct');
  } else {
    console.error('   Error:', e.message || e);
  }
  process.exit(1);
} finally {
  await prisma.$disconnect();
}

// Step 4: Ask about seeding
console.log('📊 Step 4: Initial data');
const seedProducts = process.argv.includes('--seed-products');
const seedTestUser = process.argv.includes('--seed-test-user');

if (seedProducts) {
  console.log('   Seeding products...');
  try {
    execSync('npm run seed:products', { 
      stdio: 'inherit', 
      env: { ...process.env, DATABASE_URL: cleanDbUrl },
      cwd: rootDir,
    });
    console.log('✅ Products seeded\n');
  } catch (e) {
    console.error('⚠️  Failed to seed products (this is optional)');
  }
}

if (seedTestUser) {
  console.log('   Seeding test user...');
  try {
    execSync('npm run seed:test-user', { 
      stdio: 'inherit', 
      env: { ...process.env, DATABASE_URL: cleanDbUrl },
      cwd: rootDir,
    });
    console.log('✅ Test user seeded\n');
  } catch (e) {
    console.error('⚠️  Failed to seed test user (this is optional)');
  }
}

console.log('✨ Production database setup complete!');
console.log('\n📝 Next steps:');
console.log('   1. Set DATABASE_URL in your production .env file');
console.log('   2. Set other required environment variables (see ENV.example)');
console.log('   3. Configure Stripe webhook');
console.log('   4. Deploy your application');
console.log('\n💡 Tip: Run with --seed-products to import initial product data');
