"""Utility functions for product packshot downloader."""
import re
import hashlib
import unicodedata
from pathlib import Path
from typing import Optional, Tuple
from PIL import Image
import io


def normalize_product_name(name: str) -> str:
    """Convert product name to filesystem-safe slug."""
    # Remove leading numbers and dots (e.g., "1. ", "22. ")
    name = re.sub(r'^\d+\.\s*', '', name)
    
    # Convert to lowercase
    name = name.lower()
    
    # Normalize unicode (é -> e, etc.)
    name = unicodedata.normalize('NFKD', name)
    name = name.encode('ascii', 'ignore').decode('ascii')
    
    # Replace special chars with spaces, then collapse spaces
    name = re.sub(r'[^\w\s-]', ' ', name)
    name = re.sub(r'[-\s]+', '-', name)
    
    # Remove leading/trailing dashes
    name = name.strip('-')
    
    return name


def detect_brand(product_name: str) -> str:
    """Detect brand from product name."""
    name_lower = product_name.lower()
    
    if name_lower.startswith('redken'):
        return 'Redken'
    elif name_lower.startswith('thalion') or name_lower.startswith('thalisens'):
        return 'Thalion'
    elif name_lower.startswith("l'eau"):
        return 'Thalion'
    elif name_lower.startswith('mineral booster'):
        return 'Thalion'
    elif name_lower.startswith('all soft'):
        return 'Redken'
    
    # Try to extract first word as brand
    first_word = product_name.split()[0] if product_name.split() else 'Unknown'
    return first_word


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


def calculate_file_hash(file_path: Path) -> str:
    """Calculate SHA256 hash of file."""
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            sha256.update(chunk)
    return sha256.hexdigest()


def check_white_background(image_path: Path, threshold: float = 0.85, variance_threshold: float = 0.05) -> bool:
    """Check if image has white background using edge pixel analysis."""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            width, height = img.size
            pixels = img.load()
            
            # Sample edge pixels (top, bottom, left, right)
            edge_pixels = []
            
            # Top edge
            for x in range(0, width, max(1, width // 20)):
                edge_pixels.append(pixels[x, 0])
            
            # Bottom edge
            for x in range(0, width, max(1, width // 20)):
                edge_pixels.append(pixels[x, height - 1])
            
            # Left edge
            for y in range(0, height, max(1, height // 20)):
                edge_pixels.append(pixels[0, y])
            
            # Right edge
            for y in range(0, height, max(1, height // 20)):
                edge_pixels.append(pixels[width - 1, y])
            
            if not edge_pixels:
                return False
            
            # Calculate average luminance and variance
            luminances = []
            for r, g, b in edge_pixels:
                # Relative luminance formula
                lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
                luminances.append(lum)
            
            avg_lum = sum(luminances) / len(luminances)
            variance = sum((l - avg_lum) ** 2 for l in luminances) / len(luminances)
            
            # White background: high average luminance, low variance
            return avg_lum >= threshold and variance <= variance_threshold
            
    except Exception:
        return False


def get_image_dimensions(image_path: Path) -> Optional[Tuple[int, int]]:
    """Get image dimensions."""
    try:
        with Image.open(image_path) as img:
            return img.size  # (width, height)
    except Exception:
        return None


def get_file_size(file_path: Path) -> int:
    """Get file size in bytes."""
    return file_path.stat().st_size
