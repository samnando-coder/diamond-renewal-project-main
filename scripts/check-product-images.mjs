import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read product list from shopCatalog
const shopCatalogPath = path.join(projectRoot, 'src', 'data', 'shopCatalog.ts');
const shopCatalogContent = fs.readFileSync(shopCatalogPath, 'utf8');

// Extract product names from RAW_NAMES array
const rawNamesMatch = shopCatalogContent.match(/const RAW_NAMES: string\[\] = \[([\s\S]*?)\];/);
if (!rawNamesMatch) {
  console.error('Could not find RAW_NAMES in shopCatalog.ts');
  process.exit(1);
}

const rawNamesContent = rawNamesMatch[1];
const productNames = rawNamesContent
  .split('\n')
  .map(line => {
    const match = line.match(/"([^"]+)"/);
    return match ? match[1] : null;
  })
  .filter(Boolean);

console.log(`\n📦 Totaal aantal producten: ${productNames.length}\n`);

// Get all product images from Blue Diamonds Foto's folder
const fotoFolder = path.join(projectRoot, 'public', 'Blue Diamonds Foto\'s');
const allFiles = fs.readdirSync(fotoFolder, { withFileTypes: true });

const productImages = allFiles
  .filter(file => file.isFile())
  .map(file => file.name)
  .filter(name => /^IMG_\d+\.(jpg|jpeg|png)$/i.test(name))
  .sort();

console.log(`📸 Totaal aantal productfoto's (IMG_*.jpg/jpeg/png): ${productImages.length}\n`);

// Check which images are used in the codebase
const imageForCategory = {
  haar: "/Blue Diamonds Foto's/IMG_5418.jpg",
  gezicht: "/Blue Diamonds Foto's/IMG_5412.jpg",
  lichaam: "/Blue Diamonds Foto's/IMG_5503.jpg",
  wellness: "/Blue Diamonds Foto's/IMG_5621.jpg",
};

const usedImages = new Set(Object.values(imageForCategory).map(img => path.basename(img)));

// Check for images used in other files
const checkFiles = [
  path.join(projectRoot, 'src', 'data', 'treatments.ts'),
  path.join(projectRoot, 'src', 'data', 'treatmentsCatalog.ts'),
  path.join(projectRoot, 'src', 'data', 'arrangements.ts'),
  path.join(projectRoot, 'src', 'data', 'urbanWellness.ts'),
];

checkFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.matchAll(/\/Blue Diamonds Foto's\/([^"'\s]+)/g);
    for (const match of matches) {
      usedImages.add(match[1]);
    }
  }
});

console.log(`✅ Gebruikte foto's in code: ${usedImages.size}`);
console.log(`📊 Ongebruikte productfoto's: ${productImages.length - usedImages.size}\n`);

// Show unused images
const unusedImages = productImages.filter(img => !usedImages.has(img));
if (unusedImages.length > 0) {
  console.log('📋 Ongebruikte productfoto\'s:');
  unusedImages.forEach(img => console.log(`   - ${img}`));
  console.log('');
}

// Summary
console.log('\n📊 SAMENVATTING:');
console.log(`   - Totaal producten: ${productNames.length}`);
console.log(`   - Totaal productfoto's: ${productImages.length}`);
console.log(`   - Gebruikte foto's: ${usedImages.size}`);
console.log(`   - Ongebruikte foto's: ${unusedImages.length}`);
console.log(`   - Verschil: ${productImages.length - productNames.length} foto's meer dan producten\n`);

if (productImages.length >= productNames.length) {
  console.log('✅ Je hebt genoeg productfoto\'s! Er zijn zelfs meer foto\'s dan producten.');
  console.log('   De foto\'s worden momenteel alleen gebruikt als categorie-placeholders.');
  console.log('   Om individuele productfoto\'s te gebruiken, moet je ze koppelen aan specifieke producten.\n');
} else {
  console.log(`⚠️  Je hebt ${productNames.length - productImages.length} foto's te weinig voor alle producten.`);
}
