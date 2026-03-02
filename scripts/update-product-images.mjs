#!/usr/bin/env node
/**
 * Update product images in shopCatalog.ts from packshots.csv
 * 
 * Usage: node scripts/update-product-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read packshots.csv
const packshotsPath = path.join(projectRoot, 'output', 'packshots.csv');
const shopCatalogPath = path.join(projectRoot, 'src', 'data', 'shopCatalog.ts');

console.log('📖 Reading packshots.csv...');
const packshotsContent = fs.readFileSync(packshotsPath, 'utf-8');
const lines = packshotsContent.split('\n').filter(line => line.trim());

// Parse CSV (skip header)
const packshots = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Simple CSV parsing (handle quoted fields with commas)
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  
  if (fields.length >= 9) {
    const [productName, brand, normalizedName, sizeMl, productPageUrl, imageUrl, imageSource, status, notes] = fields;
    
    // Only include products with found images
    if (status === 'found' && imageUrl && imageUrl.trim()) {
      packshots.push({
        productName: productName.trim(),
        imageUrl: imageUrl.trim(),
        status
      });
    }
  }
}

console.log(`✅ Found ${packshots.length} products with images`);

// Read shopCatalog.ts
console.log('📖 Reading shopCatalog.ts...');
const shopCatalogContent = fs.readFileSync(shopCatalogPath, 'utf-8');

// Extract RAW_NAMES array
const rawNamesMatch = shopCatalogContent.match(/const RAW_NAMES: string\[\] = \[([\s\S]*?)\];/);
if (!rawNamesMatch) {
  console.error('❌ Could not find RAW_NAMES in shopCatalog.ts');
  process.exit(1);
}

// Create mapping: product name -> image URL
const imageMap = new Map();
for (const packshot of packshots) {
  // Normalize product name for matching (remove extra spaces, normalize dashes)
  const normalized = packshot.productName
    .replace(/\s+/g, ' ')
    .replace(/–/g, '–') // Keep en-dash
    .trim();
  
  imageMap.set(normalized, packshot.imageUrl);
  
  // Also try without leading brand name for better matching
  const withoutBrand = normalized.replace(/^(Redken|Thalion|ThaliSens|L'eau)\s+/i, '').trim();
  if (withoutBrand !== normalized) {
    imageMap.set(withoutBrand, packshot.imageUrl);
  }
}

console.log(`📊 Created image mapping with ${imageMap.size} entries`);

// Create productImageMap object
const productImageMap = {};

// Parse RAW_NAMES to match with packshots
const rawNamesContent = rawNamesMatch[1];
const productNames = [];
const namePattern = /"([^"]+)"/g;
let match;
while ((match = namePattern.exec(rawNamesContent)) !== null) {
  productNames.push(match[1]);
}

console.log(`📦 Found ${productNames.length} products in shopCatalog.ts`);

// Match products and create mapping
let matched = 0;
let notMatched = [];

for (const productName of productNames) {
  // Try exact match first
  let imageUrl = imageMap.get(productName);
  
  // Try normalized match (remove extra spaces)
  if (!imageUrl) {
    const normalized = productName.replace(/\s+/g, ' ').trim();
    imageUrl = imageMap.get(normalized);
  }
  
  // Try without brand prefix
  if (!imageUrl) {
    const withoutBrand = productName.replace(/^(Redken|Thalion|ThaliSens|L'eau)\s+/i, '').trim();
    imageUrl = imageMap.get(withoutBrand);
  }
  
  // Try fuzzy match (check if any packshot name contains key parts)
  if (!imageUrl) {
    const productKey = productName.toLowerCase()
      .replace(/^(redken|thalion|thalisens|l'eau)\s+/i, '')
      .replace(/\s*–\s*|\s*-\s*/g, ' ')
      .replace(/\s*\d+\s*(ml|g|kg|caps|sachets|pcs|amp\.?)\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    for (const [packshotName, url] of imageMap.entries()) {
      const packshotKey = packshotName.toLowerCase()
        .replace(/^(redken|thalion|thalisens|l'eau)\s+/i, '')
        .replace(/\s*–\s*|\s*-\s*/g, ' ')
        .replace(/\s*\d+\s*(ml|g|kg|caps|sachets|pcs|amp\.?)\s*/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Check if key parts match
      if (productKey.length > 5 && packshotKey.includes(productKey.substring(0, Math.min(20, productKey.length)))) {
        imageUrl = url;
        break;
      }
    }
  }
  
  if (imageUrl) {
    productImageMap[productName] = imageUrl;
    matched++;
  } else {
    notMatched.push(productName);
  }
}

console.log(`✅ Matched ${matched} products with images`);
console.log(`⚠️  ${notMatched.length} products without match`);

if (notMatched.length > 0 && notMatched.length <= 20) {
  console.log('\n📋 Products without match:');
  notMatched.forEach(name => console.log(`   - ${name}`));
}

// Generate the productImageMap code
const mapEntries = Object.entries(productImageMap)
  .map(([name, url]) => `  "${name.replace(/"/g, '\\"')}": "${url.replace(/"/g, '\\"')}",`)
  .join('\n');

const newMapCode = `// Product image mapping from packshots.csv
// Auto-generated by scripts/update-product-images.mjs
const productImageMap: Record<string, string> = {
${mapEntries}
};`;

// Find where to insert the map (before imageForCategory)
const imageForCategoryMatch = shopCatalogContent.match(/(const imageForCategory: Record<ShopCategory, string> = \{)/);
if (!imageForCategoryMatch) {
  console.error('❌ Could not find imageForCategory in shopCatalog.ts');
  process.exit(1);
}

// Check if productImageMap already exists
if (shopCatalogContent.includes('const productImageMap:')) {
  // Replace existing map
  const existingMapMatch = shopCatalogContent.match(/\/\/ Product image mapping[\s\S]*?const productImageMap: Record<string, string> = \{[\s\S]*?\};/);
  if (existingMapMatch) {
    const updatedContent = shopCatalogContent.replace(
      /\/\/ Product image mapping[\s\S]*?const productImageMap: Record<string, string> = \{[\s\S]*?\};/,
      newMapCode
    );
    fs.writeFileSync(shopCatalogPath, updatedContent, 'utf-8');
    console.log('✅ Updated existing productImageMap in shopCatalog.ts');
  } else {
    console.error('❌ Found productImageMap but could not replace it');
    process.exit(1);
  }
} else {
  // Insert new map before imageForCategory
  const insertPosition = imageForCategoryMatch.index;
  const beforeMap = shopCatalogContent.substring(0, insertPosition);
  const afterMap = shopCatalogContent.substring(insertPosition);
  
  const updatedContent = beforeMap + newMapCode + '\n\n' + afterMap;
  fs.writeFileSync(shopCatalogPath, updatedContent, 'utf-8');
  console.log('✅ Added productImageMap to shopCatalog.ts');
}

// Now update the SHOP_PRODUCTS mapping to use productImageMap
const updatedContent = fs.readFileSync(shopCatalogPath, 'utf-8');

// Find the SHOP_PRODUCTS mapping
const shopProductsMatch = updatedContent.match(/(export const SHOP_PRODUCTS: ShopProduct\[\] = RAW_NAMES\.map\(\(name, idx\) => \{[\s\S]*?image: imageForCategory\[category\],[\s\S]*?\}\);)/);
if (shopProductsMatch) {
  // Replace image assignment to use productImageMap with fallback
  const newImageAssignment = `    image: productImageMap[name] || imageForCategory[category],`;
  const updatedProducts = updatedContent.replace(
    /image: imageForCategory\[category\],/,
    newImageAssignment
  );
  fs.writeFileSync(shopCatalogPath, updatedProducts, 'utf-8');
  console.log('✅ Updated SHOP_PRODUCTS to use productImageMap');
} else {
  console.warn('⚠️  Could not find SHOP_PRODUCTS mapping to update');
}

console.log('\n✨ Done! Product images have been updated.');
console.log(`📊 Summary: ${matched} products now have individual images`);
