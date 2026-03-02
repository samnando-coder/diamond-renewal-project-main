"""Parser for SHOP_PRODUCTEN_LIJST.md file."""
import re
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass


@dataclass
class Product:
    """Product information."""
    name: str
    brand: str
    line: str
    original_line: str  # Original line from file for context


def parse_markdown_file(file_path: Path) -> List[Product]:
    """Parse markdown file and extract products with their lines/categories."""
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    products: List[Product] = []
    current_heading: Optional[str] = None
    current_section: Optional[str] = None  # Redken or Thalion section
    
    for line in lines:
        line = line.strip()
        
        # Skip empty lines and certain sections
        if not line or line.startswith('#') or line.startswith('**') or line.startswith('---'):
            continue
        
        # Detect section (Redken or Thalion)
        if '## 🧴 Redken' in line or '## Redken' in line:
            current_section = 'Redken'
            current_heading = None
            continue
        elif '## 🌊 Thalion' in line or '## Thalion' in line:
            current_section = 'Thalion'
            current_heading = None
            continue
        elif line.startswith('## 📦') or line.startswith('## 📝'):
            # Stop at categories/notes section
            break
        
        # Detect heading (### Line Name)
        if line.startswith('### '):
            heading_text = line.replace('### ', '').strip()
            # Remove emoji and extra text
            heading_text = re.sub(r'^[^\w\s]+', '', heading_text)
            heading_text = re.sub(r'\s*\(.*?\)\s*$', '', heading_text)  # Remove (description)
            heading_text = heading_text.strip()
            
            if heading_text and not heading_text.lower().startswith('overzicht'):
                current_heading = heading_text
            continue
        
        # Extract product from numbered list (e.g., "1. Product Name – 300 ml")
        # or bullet list (e.g., "- Product Name")
        # Match pattern: number. Product Name – size OR - Product Name
        product_match = re.match(r'^(?:\d+\.\s*)(.+)$', line)
        
        if product_match:
            product_text = product_match.group(1).strip()
            
            # Skip if it's clearly not a product (too short, is a heading, etc.)
            if len(product_text) < 5:
                continue
            
            # Skip if it contains "producten" or "totaal" (summary lines)
            if any(word in product_text.lower() for word in ['producten', 'totaal', 'alle', 'lijn', 'totaal aantal']):
                continue
            
            # Check if it looks like a product name (contains brand or size indicator)
            has_brand = any(brand in product_text for brand in ['Redken', 'Thalion', 'ThaliSens', "L'eau", 'Mineral Booster', 'All Soft'])
            has_size = bool(re.search(r'\d+\s*(?:ml|caps|sachets|amp\.|pcs|sachet|g|kg)', product_text, re.IGNORECASE))
            
            if has_brand or has_size:
                # Determine brand
                brand = 'Unknown'
                if 'Redken' in product_text or product_text.startswith('All Soft'):
                    brand = 'Redken'
                elif 'Thalion' in product_text or 'ThaliSens' in product_text or product_text.startswith("L'eau") or product_text.startswith('Mineral Booster'):
                    brand = 'Thalion'
                
                # Determine line
                line_name = 'Unknown'
                if brand == 'Redken':
                    line_name = detect_redken_line(product_text)
                elif brand == 'Thalion':
                    line_name = detect_thalion_line(product_text, current_heading)
                
                products.append(Product(
                    name=product_text,
                    brand=brand,
                    line=line_name,
                    original_line=current_heading or 'Unknown'
                ))
    
    return products


def detect_redken_line(product_name: str) -> str:
    """Detect Redken product line from name."""
    name_lower = product_name.lower()
    
    lines = [
        ('extreme', 'Extreme'),
        ('blondage', 'Blondage'),
        ('cerafill', 'Cerafill'),
        ('amino mint', 'Amino Mint'),
        ('all soft', 'All Soft'),
        ('acidic color gloss', 'Acidic Color Gloss'),
        ('acidic bonding concentrate', 'Acidic Bonding Concentrate'),
        ('acidic bonding curls', 'Acidic Bonding Curls'),
        ('acidic grow full', 'Acidic Grow Full'),
    ]
    
    for keyword, line_name in lines:
        if keyword in name_lower:
            return line_name
    
    return 'Other'


def detect_thalion_line(product_name: str, current_heading: Optional[str] = None) -> str:
    """Detect Thalion product line from name or heading."""
    name_lower = product_name.lower()
    
    # Use heading if available
    if current_heading:
        heading_lower = current_heading.lower()
        if 'thalisens' in heading_lower:
            return 'ThaliSens'
        elif 'tvs' in heading_lower or 'cellulite' in heading_lower:
            return 'TVS'
        elif 'wellness' in heading_lower or 'supplements' in heading_lower:
            return 'Wellness'
        elif 'body care' in heading_lower:
            return 'Body Care'
        elif 'magnesium' in heading_lower:
            return 'Magnesium'
        elif 'perfumed mists' in heading_lower:
            return 'Perfumed Mists'
        elif 'animation kits' in heading_lower or 'gift sets' in heading_lower:
            return 'Animation Kits'
        elif 'tw' in heading_lower or 'skin tone' in heading_lower:
            return 'TW'
        elif 'suntan' in heading_lower or 'spf' in heading_lower:
            return 'SPF'
        elif 'bb cream' in heading_lower:
            return 'BB Creams'
        elif 'cleansers' in heading_lower:
            return 'Cleansers'
        elif 'eye care' in heading_lower or 'oc' in heading_lower:
            return 'Eye Care'
        elif 'nutri-marine' in heading_lower:
            return 'Nutri-Marine'
        elif 'hydra-marine' in heading_lower:
            return 'Hydra-Marine'
        elif 'mineral booster' in heading_lower:
            return 'Mineral Booster'
        elif 'men' in heading_lower:
            return 'MEN'
        elif 'serums' in heading_lower:
            return 'Serums'
        elif 'toners' in heading_lower or 'lotions' in heading_lower:
            return 'Toners'
        elif 'masks' in heading_lower or 'scrubs' in heading_lower:
            return 'Masks'
        elif 'algopur' in heading_lower:
            return 'Algopur'
        elif 'algolift' in heading_lower:
            return 'Algolift'
        elif 'algocalm' in heading_lower:
            return 'AlgoCalm'
        elif 'algo energie' in heading_lower or 'algo energetic' in heading_lower:
            return 'Algo Energie'
        elif 'al ' in heading_lower or 'anti-aging' in heading_lower:
            return 'AL'
        elif 'essential' in heading_lower or 'basic' in heading_lower:
            return 'Essential'
        elif 'ocean secrets' in heading_lower:
            return 'Ocean Secrets'
        elif 'precious oil' in heading_lower:
            return 'Precious Oil'
    
    # Fallback: detect from product name
    if 'thalisens' in name_lower:
        return 'ThaliSens'
    elif 'tvs' in name_lower or 'tsv' in name_lower:
        return 'TVS'
    elif 'tw' in name_lower:
        return 'TW'
    elif 'oc' in name_lower:
        return 'Eye Care'
    elif 'nutri-marine' in name_lower:
        return 'Nutri-Marine'
    elif 'hydra-marine' in name_lower:
        return 'Hydra-Marine'
    elif 'mineral booster' in name_lower:
        return 'Mineral Booster'
    elif 'men' in name_lower:
        return 'MEN'
    elif 'algopur' in name_lower:
        return 'Algopur'
    elif 'algolift' in name_lower:
        return 'Algolift'
    elif 'algocalm' in name_lower:
        return 'AlgoCalm'
    elif 'algo energie' in name_lower or 'algo energetic' in name_lower:
        return 'Algo Energie'
    elif name_lower.startswith('al ') or 'anti-aging' in name_lower:
        return 'AL'
    elif 'ocean secrets' in name_lower:
        return 'Ocean Secrets'
    
    return 'Unknown'
