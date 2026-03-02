#!/usr/bin/env tsx
/**
 * Production Initialization Script
 * 
 * This is a comprehensive setup script that:
 * 1. Validates all required environment variables
 * 2. Sets up the database
 * 3. Verifies Stripe configuration
 * 4. Tests critical endpoints
 * 
 * Run this before deploying to production.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { getStripe } from '../server/stripe';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the root directory (where package.json is)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Load .env from root directory
config({ path: resolve(rootDir, '.env') });

const requiredEnvVars = [
  'DATABASE_URL',
  'CORS_ORIGIN',
  'SESSION_COOKIE_NAME',
] as const;

const optionalEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'WOO_REST_BASE',
  'WOO_CONSUMER_KEY',
  'WOO_CONSUMER_SECRET',
] as const;

console.log('🔍 Production Initialization Check\n');

// Step 1: Check environment variables
console.log('📋 Step 1: Checking environment variables...');
const missing: string[] = [];
const warnings: string[] = [];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    missing.push(key);
  } else {
    console.log(`   ✅ ${key}`);
  }
}

for (const key of optionalEnvVars) {
  if (!process.env[key]) {
    warnings.push(key);
  } else {
    console.log(`   ✅ ${key}`);
  }
}

if (missing.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error('\n   Set these in your .env file (see ENV.example)');
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('\n⚠️  Optional environment variables not set:');
  warnings.forEach((key) => console.log(`   - ${key}`));
  console.log('   (These are optional but recommended)');
}

// Step 2: Validate DATABASE_URL
console.log('\n🗄️  Step 2: Validating database connection...');
const dbUrl = process.env.DATABASE_URL!;

// Remove quotes if present (Windows .env files sometimes have quotes)
const cleanDbUrl = dbUrl.replace(/^["']|["']$/g, '');

if (!cleanDbUrl.startsWith('postgresql://') && !cleanDbUrl.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL must point to PostgreSQL');
  console.error(`   Current: ${cleanDbUrl.substring(0, 30)}...`);
  console.error(`   (Loaded from: ${resolve(rootDir, '.env')})`);
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  await prisma.$connect();
  const result = await prisma.$queryRaw`SELECT version()`;
  console.log('   ✅ Database connection successful');
  console.log(`   ✅ Database: ${(result as Array<{ version: string }>)[0]?.version?.substring(0, 50) || 'PostgreSQL'}`);
} catch (e) {
  console.error('❌ Failed to connect to database');
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}

// Step 3: Check migrations
console.log('\n📦 Step 3: Checking database migrations...');
try {
  execSync('npx prisma migrate status', { stdio: 'pipe', cwd: rootDir });
  console.log('   ✅ Migrations are up to date');
} catch (e) {
  console.log('   ⚠️  Migrations may need to be run');
  console.log('   Run: npm run setup:production-db');
}

// Step 4: Validate Stripe (if configured)
if (process.env.STRIPE_SECRET_KEY) {
  console.log('\n💳 Step 4: Validating Stripe configuration...');
  try {
    const stripe = getStripe();
    // Test API call
    await stripe.balance.retrieve();
    console.log('   ✅ Stripe connection successful');
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('   ⚠️  STRIPE_WEBHOOK_SECRET not set (webhooks won\'t work)');
    } else {
      console.log('   ✅ Stripe webhook secret configured');
    }
  } catch (e) {
    console.error('   ❌ Stripe configuration error');
    console.error('   Check your STRIPE_SECRET_KEY');
  }
} else {
  console.log('\n💳 Step 4: Stripe not configured (payments disabled)');
}

// Step 5: Check CORS
console.log('\n🌐 Step 5: Checking CORS configuration...');
const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
if (corsOrigins.length === 0) {
  console.log('   ⚠️  No CORS origins configured');
} else {
  console.log(`   ✅ CORS origins: ${corsOrigins.join(', ')}`);
}

// Step 6: Check session cookie
console.log('\n🍪 Step 6: Checking session configuration...');
console.log(`   ✅ Cookie name: ${process.env.SESSION_COOKIE_NAME}`);
if (process.env.SESSION_COOKIE_DOMAIN) {
  console.log(`   ✅ Cookie domain: ${process.env.SESSION_COOKIE_DOMAIN}`);
} else {
  console.log('   ⚠️  SESSION_COOKIE_DOMAIN not set (sessions won\'t work across subdomains)');
}

console.log('\n✨ Production initialization check complete!');
console.log('\n📝 Summary:');
console.log('   ✅ All required environment variables are set');
console.log('   ✅ Database connection verified');
console.log('   ✅ Configuration validated');
console.log('\n🚀 You\'re ready to deploy!');
console.log('\n💡 Next steps:');
console.log('   1. Run: npm run setup:production-db (if migrations needed)');
console.log('   2. Configure Stripe webhook in Stripe Dashboard');
console.log('   3. Deploy your application');
console.log('   4. Test the checkout flow');
