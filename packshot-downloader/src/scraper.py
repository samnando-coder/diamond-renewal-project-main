"""Web scraper for Redken and Thalion official websites."""
import re
import asyncio
import aiohttp
from typing import List, Dict, Optional
from dataclasses import dataclass
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup


@dataclass
class ImageResult:
    """Image search result from scraping."""
    url: str
    width: Optional[int] = None
    height: Optional[int] = None
    product_name: Optional[str] = None


class WebsiteScraper:
    """Scraper for official brand websites."""
    
    def __init__(self, max_concurrent: int = 3):
        self.session: Optional[aiohttp.ClientSession] = None
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
        
        # Brand website URLs
        self.redken_base = "https://www.redken.eu"
        self.thalion_base = "https://www.thalion.com"
        
        # Headers to mimic browser
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,nl;q=0.8',
            'Accept-Encoding': 'gzip, deflate',  # Remove br (brotli) - aiohttp will handle it if brotli is installed
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    
    async def __aenter__(self):
        # Enable automatic decompression (including brotli if available)
        connector = aiohttp.TCPConnector()
        self.session = aiohttp.ClientSession(
            headers=self.headers,
            connector=connector,
            auto_decompress=True
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def _normalize_product_name(self, name: str) -> str:
        """Normalize product name for matching."""
        # Remove special characters, convert to lowercase
        name = re.sub(r'[^\w\s]', ' ', name.lower())
        # Remove extra spaces
        name = ' '.join(name.split())
        return name
    
    def _extract_keywords(self, product_name: str) -> List[str]:
        """Extract search keywords from product name."""
        # Remove brand name
        name = product_name.lower()
        for brand in ['redken', 'thalion', 'thalisens']:
            name = name.replace(brand, '')
        
        # Extract key terms (remove common words)
        stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'ml', 'caps', 'sachets'}
        words = [w for w in name.split() if w not in stop_words and len(w) > 2]
        
        return words[:5]  # Top 5 keywords
    
    def _extract_line_slug(self, product_name: str) -> Optional[str]:
        """Extract Redken line slug from product name."""
        name_lower = product_name.lower()
        
        # Map lines to slugs
        line_mapping = {
            'color extend blondage': 'color-extend-blondage',
            'blondage high bright': 'blondage-high-bright',
            'extreme': 'extreme',
            'extreme length': 'extreme-length',
            'all soft': 'all-soft',
            'all soft mega curls': 'all-soft-mega-curls',
            'acidic color gloss': 'acidic-color-gloss',
            'acidic bonding concentrate': 'acidic-bonding-concentrate',
            'acidic bonding curls': 'acidic-bonding-curls',
            'acidic grow full': 'acidic-grow-full',
            'cerafill': 'cerafill',
        }
        
        for line_name, slug in line_mapping.items():
            if line_name in name_lower:
                return slug
        
        return None
    
    def _create_product_slug(self, product_name: str) -> str:
        """Create a URL-friendly slug from product name."""
        # Remove brand name
        name = re.sub(r'^(redken|thalion)\s+', '', product_name, flags=re.IGNORECASE)
        
        # Remove size info (e.g., "300 ml", "60 caps")
        name = re.sub(r'\s*–\s*\d+\s*(ml|caps|sachets|amp)', '', name, flags=re.IGNORECASE)
        name = re.sub(r'\s+\d+\s*(ml|caps|sachets|amp)', '', name, flags=re.IGNORECASE)
        
        # Convert to lowercase and normalize
        name = name.lower()
        name = re.sub(r'[^\w\s-]', '', name)  # Remove special chars
        name = re.sub(r'\s+', '-', name)  # Spaces to dashes
        name = name.strip('-')
        
        return name
    
    def _detect_thalion_category(self, product_name: str) -> List[str]:
        """Detect Thalion product category from name."""
        name_lower = product_name.lower()
        categories = []
        
        # Check for marine nutrition (caps, supplements)
        if any(keyword in name_lower for keyword in ['caps', 'capsules', 'supplement', 'burning fat', 'slimming', 'silhouette']):
            categories.append('marine-nutrition')
        
        # Check for face products
        if any(keyword in name_lower for keyword in ['cream', 'serum', 'mask', 'cleanser', 'toner', 'lotion']):
            categories.append('face')
        
        # Check for body products
        if any(keyword in name_lower for keyword in ['body', 'shower', 'gel', 'scrub']):
            categories.append('body')
        
        # Default to face if no match
        if not categories:
            categories = ['face', 'body']
        
        return categories
    
    async def _fetch_page(self, url: str) -> Optional[str]:
        """Fetch HTML page content."""
        async with self.semaphore:
            try:
                async with self.session.get(
                    url,
                    timeout=aiohttp.ClientTimeout(total=30),
                    allow_redirects=True
                ) as response:
                    if response.status == 200:
                        return await response.text()
                    else:
                        return None
            except Exception as e:
                print(f"  Warning: Error fetching {url}: {str(e)[:100]}")
                return None
    
    async def search_redken(self, product_name: str) -> List[ImageResult]:
        """Search for Redken product images."""
        results = []
        
        # Strategy 1: Try to find all images on the products page and match by keywords
        search_url = f"{self.redken_base}/nl-nl/products"
        html = await self._fetch_page(search_url)
        
        keywords = self._extract_keywords(product_name)
        
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find ALL images on the page (modern sites load via JS, but images might be in HTML)
            all_images = soup.find_all('img')
            
            for img in all_images:
                src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or img.get('data-original')
                if not src:
                    continue
                
                # Skip obvious non-product images
                if any(skip in src.lower() for skip in ['logo', 'icon', 'banner', 'header', 'footer', 'social', 'facebook', 'instagram']):
                    continue
                
                # Make absolute URL
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = urljoin(self.redken_base, src)
                elif not src.startswith('http'):
                    src = urljoin(self.redken_base, src)
                
                # Check if image URL or alt text contains product keywords
                alt_text = (img.get('alt') or '').lower()
                title_text = (img.get('title') or '').lower()
                url_lower = src.lower()
                
                # Match if keywords appear in alt, title, or URL
                match_score = 0
                for kw in keywords:
                    if kw in alt_text or kw in title_text or kw in url_lower:
                        match_score += 1
                
                if match_score >= 1:  # At least 1 keyword match
                    width = img.get('width')
                    height = img.get('height')
                    
                    # Try high-res variants
                    highres_variants = [
                        src.replace('_small', '_large'),
                        src.replace('_thumb', '_large'),
                        src.replace('_medium', '_large'),
                        src.replace('/small/', '/large/'),
                        src.replace('/thumb/', '/large/'),
                    ]
                    
                    # Add original and high-res variants
                    for variant in [src] + highres_variants:
                        if variant != src and variant in results:
                            continue
                        results.append(ImageResult(
                            url=variant,
                            width=int(width) if width and width.isdigit() else None,
                            height=int(height) if height and height.isdigit() else None,
                            product_name=product_name
                        ))
        
        # Strategy 2: Try direct product page URLs using correct Redken URL pattern
        # Pattern: /nl-be/products/haircare/{line-slug}/{product-slug}
        # Example: /nl-be/products/haircare/color-extend-blondage/color-extend-blondage-shampoo
        
        # Extract line from product name
        line_slug = self._extract_line_slug(product_name)
        product_slug = self._create_product_slug(product_name)
        
        # Try both nl-be and nl-nl locales
        locales = ['nl-be', 'nl-nl']
        
        for locale in locales:
            if line_slug and product_slug:
                # Try full path: /products/haircare/{line}/{product}
                product_url = f"{self.redken_base}/{locale}/products/haircare/{line_slug}/{product_slug}"
                html2 = await self._fetch_page(product_url)
                
                if html2:
                    soup2 = BeautifulSoup(html2, 'html.parser')
                    # Find all images
                    page_images = soup2.find_all('img')
                    
                    for img in page_images:
                        src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or img.get('data-original')
                        if src and not any(skip in src.lower() for skip in ['logo', 'icon', 'banner', 'header', 'footer']):
                            if src.startswith('//'):
                                src = 'https:' + src
                            elif src.startswith('/'):
                                src = urljoin(self.redken_base, src)
                            elif not src.startswith('http'):
                                src = urljoin(self.redken_base, src)
                            
                            results.append(ImageResult(
                                url=src,
                                product_name=product_name
                            ))
                    
                    # If we found images, we're done with this locale
                    if page_images:
                        break
            
            # Fallback: try simpler pattern /products/{product-slug}
            if product_slug:
                product_url = f"{self.redken_base}/{locale}/products/{product_slug}"
                html2 = await self._fetch_page(product_url)
                
                if html2:
                    soup2 = BeautifulSoup(html2, 'html.parser')
                    page_images = soup2.find_all('img')
                    
                    for img in page_images:
                        src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                        if src and not any(skip in src.lower() for skip in ['logo', 'icon', 'banner']):
                            if src.startswith('//'):
                                src = 'https:' + src
                            elif src.startswith('/'):
                                src = urljoin(self.redken_base, src)
                            
                            results.append(ImageResult(
                                url=src,
                                product_name=product_name
                            ))
        
        # Deduplicate by URL
        seen = set()
        unique_results = []
        for r in results:
            if r.url not in seen:
                seen.add(r.url)
                unique_results.append(r)
        
        return unique_results
    
    async def search_thalion(self, product_name: str) -> List[ImageResult]:
        """Search for Thalion product images."""
        results = []
        
        keywords = self._extract_keywords(product_name)
        
        # Strategy 1: Try product listing pages (Face and Body)
        search_urls = [
            f"{self.thalion_base}/en/face",
            f"{self.thalion_base}/en/body",
        ]
        
        for search_url in search_urls:
            html = await self._fetch_page(search_url)
            if not html:
                continue
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find ALL images on page
            all_images = soup.find_all('img')
            
            for img in all_images:
                src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or img.get('data-original')
                if not src:
                    continue
                
                # Skip non-product images
                if any(skip in src.lower() for skip in ['logo', 'icon', 'banner', 'header', 'footer', 'social']):
                    continue
                
                # Make absolute URL
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = urljoin(self.thalion_base, src)
                elif not src.startswith('http'):
                    src = urljoin(self.thalion_base, src)
                
                # Check for keyword match in alt, title, or URL
                alt_text = (img.get('alt') or '').lower()
                title_text = (img.get('title') or '').lower()
                url_lower = src.lower()
                
                match_score = sum(1 for kw in keywords if kw in alt_text or kw in title_text or kw in url_lower)
                
                if match_score >= 1:
                    results.append(ImageResult(
                        url=src,
                        product_name=product_name
                    ))
        
        # Strategy 2: Try direct product page URLs using correct Thalion URL pattern
        # Pattern: /en/our-products/{category}/{product-slug}/
        # Example: /en/our-products/marine-nutrition/super-silhouette/
        
        product_slug = self._create_product_slug(product_name)
        
        # Determine category based on product name
        categories = self._detect_thalion_category(product_name)
        
        for category in categories:
            product_url = f"{self.thalion_base}/en/our-products/{category}/{product_slug}/"
            html = await self._fetch_page(product_url)
            
            if html:
                soup = BeautifulSoup(html, 'html.parser')
                
                # Find all images
                page_images = soup.find_all('img')
                
                for img in page_images:
                    src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or img.get('data-original')
                    if src and not any(skip in src.lower() for skip in ['logo', 'icon', 'banner', 'header', 'footer']):
                        if src.startswith('//'):
                            src = 'https:' + src
                        elif src.startswith('/'):
                            src = urljoin(self.thalion_base, src)
                        elif not src.startswith('http'):
                            src = urljoin(self.thalion_base, src)
                        
                        results.append(ImageResult(
                            url=src,
                            product_name=product_name
                        ))
                
                # If we found images, we're done
                if page_images:
                    break
        
        # Fallback: try old pattern /en/face/{slug} and /en/body/{slug}
        for slug_variant in [product_slug, product_slug.replace('thalion-', '')]:
            for path in ['/en/face/', '/en/body/']:
                product_url = f"{self.thalion_base}{path}{slug_variant}"
                html = await self._fetch_page(product_url)
                
                if html:
                    soup = BeautifulSoup(html, 'html.parser')
                    page_images = soup.find_all('img')
                    
                    for img in page_images:
                        src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                        if src and not any(skip in src.lower() for skip in ['logo', 'icon', 'banner']):
                            if src.startswith('//'):
                                src = 'https:' + src
                            elif src.startswith('/'):
                                src = urljoin(self.thalion_base, src)
                            
                            results.append(ImageResult(
                                url=src,
                                product_name=product_name
                            ))
        
        # Deduplicate
        seen = set()
        unique_results = []
        for r in results:
            if r.url not in seen:
                seen.add(r.url)
                unique_results.append(r)
        
        return unique_results
    
    def _extract_line_slug(self, product_name: str) -> Optional[str]:
        """Extract Redken line slug from product name."""
        name_lower = product_name.lower()
        
        # Map lines to slugs
        line_mapping = {
            'color extend blondage': 'color-extend-blondage',
            'blondage high bright': 'blondage-high-bright',
            'extreme': 'extreme',
            'extreme length': 'extreme-length',
            'all soft': 'all-soft',
            'all soft mega curls': 'all-soft-mega-curls',
            'acidic color gloss': 'acidic-color-gloss',
            'acidic bonding concentrate': 'acidic-bonding-concentrate',
            'acidic bonding curls': 'acidic-bonding-curls',
            'acidic grow full': 'acidic-grow-full',
            'cerafill': 'cerafill',
        }
        
        for line_name, slug in line_mapping.items():
            if line_name in name_lower:
                return slug
        
        return None
    
    def _create_product_slug(self, product_name: str) -> str:
        """Create a URL-friendly slug from product name."""
        # Remove brand name
        name = re.sub(r'^(redken|thalion)\s+', '', product_name, flags=re.IGNORECASE)
        
        # Remove size info (e.g., "300 ml", "60 caps")
        name = re.sub(r'\s*–\s*\d+\s*(ml|caps|sachets|amp)', '', name, flags=re.IGNORECASE)
        name = re.sub(r'\s+\d+\s*(ml|caps|sachets|amp)', '', name, flags=re.IGNORECASE)
        
        # Convert to lowercase and normalize
        name = name.lower()
        name = re.sub(r'[^\w\s-]', '', name)  # Remove special chars
        name = re.sub(r'\s+', '-', name)  # Spaces to dashes
        name = name.strip('-')
        
        return name
    
    def _detect_thalion_category(self, product_name: str) -> List[str]:
        """Detect Thalion product category from name."""
        name_lower = product_name.lower()
        categories = []
        
        # Check for marine nutrition (caps, supplements)
        if any(keyword in name_lower for keyword in ['caps', 'capsules', 'supplement', 'burning fat', 'slimming', 'silhouette']):
            categories.append('marine-nutrition')
        
        # Check for face products
        if any(keyword in name_lower for keyword in ['cream', 'serum', 'mask', 'cleanser', 'toner', 'lotion']):
            categories.append('face')
        
        # Check for body products
        if any(keyword in name_lower for keyword in ['body', 'shower', 'gel', 'scrub']):
            categories.append('body')
        
        # Default to face if no match
        if not categories:
            categories = ['face', 'body']
        
        return categories
    
    async def search(self, product_name: str, brand: str) -> List[ImageResult]:
        """Search for product images based on brand."""
        try:
            if brand.lower() == 'redken':
                return await self.search_redken(product_name)
            elif brand.lower() == 'thalion':
                return await self.search_thalion(product_name)
            else:
                print(f"  Warning: Unknown brand: {brand}")
                return []
        except Exception as e:
            print(f"  Warning: Error searching {brand} website: {str(e)[:100]}")
            return []
