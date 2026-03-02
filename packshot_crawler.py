#!/usr/bin/env python3
"""
Packshot URL Collector - Betrouwbare crawler voor Thalion en Redken productfoto's.

Gebruik:
    py packshot_crawler.py --input SHOP_PRODUCTEN_LIJST.md --out output/packshots.csv
"""
import re
import csv
import time
import logging
import argparse
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from urllib.parse import urljoin, urlparse
from dataclasses import dataclass, field

from playwright.sync_api import sync_playwright, Page, Browser, BrowserContext
from bs4 import BeautifulSoup
from rapidfuzz import fuzz, process


# Setup logging directory first
Path('output').mkdir(exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('output/debug.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class Product:
    """Product from input markdown file."""
    name: str
    brand: str
    normalized_name: str = field(init=False)
    size_ml: Optional[int] = None
    notes: str = ""

    def __post_init__(self):
        self.normalized_name = self._normalize_name(self.name)
        self.size_ml = self._extract_size(self.name)
        if self.size_ml is None:
            self.notes = "Size not found or complex format"

    @staticmethod
    def _normalize_name(name: str) -> str:
        """Normalize product name for matching."""
        # Remove brand prefix
        name = re.sub(r'^(Redken|Thalion|ThaliSens|L\'eau)\s+', '', name, flags=re.IGNORECASE)
        # Lowercase
        name = name.lower()
        # Remove accents (simple approach)
        name = name.replace('é', 'e').replace('è', 'e').replace('ê', 'e')
        name = name.replace('à', 'a').replace('â', 'a')
        name = name.replace('ç', 'c')
        name = name.replace('–', '-').replace('—', '-')
        # Remove size indicators
        name = re.sub(r'\s*\d+\s*(ml|g|kg|caps|sachets|pcs|amp\.?)\s*', ' ', name, flags=re.IGNORECASE)
        name = re.sub(r'\s*\d+\s*x\s*\d+\s*(ml|g)\s*', ' ', name, flags=re.IGNORECASE)
        # Clean up spaces
        name = re.sub(r'\s+', ' ', name).strip()
        return name

    @staticmethod
    def _extract_size(text: str) -> Optional[int]:
        """Extract size in ml from product name."""
        # Pattern: "300 ml", "190ml", "10 amp. x 10ml" -> extract last number
        # First try "X x Yml" pattern (e.g., "10 amp. x 10ml")
        multi_match = re.search(r'(\d+)\s*(?:amp\.?|x)\s*x\s*(\d+)\s*ml', text, re.IGNORECASE)
        if multi_match:
            return int(multi_match.group(2))  # Use the second number (the ml amount)
        
        # Then try standard "Nml" or "N ml"
        ml_match = re.search(r'(\d+)\s*ml', text, re.IGNORECASE)
        if ml_match:
            return int(ml_match.group(1))
        
        return None


@dataclass
class ProductCandidate:
    """Product candidate found on website."""
    name: str
    url: str
    brand: str


@dataclass
class PackshotResult:
    """Final packshot result."""
    product_name: str
    brand: str
    normalized_name: str
    size_ml: Optional[int]
    product_page_url: str
    image_url: str
    image_source: str  # "og:image", "srcset", "img_tag", etc.
    status: str  # "found", "not_found", "error"
    notes: str = ""


class PackshotCrawler:
    """Main crawler class."""

    def __init__(
        self,
        headless: bool = True,
        timeout: int = 20000,
        rate_limit: float = 1.5,
        min_score: int = 80,
        max_retries: int = 3
    ):
        self.headless = headless
        self.timeout = timeout
        self.rate_limit = rate_limit  # seconds between requests
        self.min_score = min_score
        self.max_retries = max_retries
        self.last_request_time = 0
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

    def _rate_limit_wait(self):
        """Enforce rate limiting."""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.rate_limit:
            time.sleep(self.rate_limit - elapsed)
        self.last_request_time = time.time()

    def _setup_browser(self):
        """Initialize browser and context."""
        playwright = sync_playwright().start()
        self.browser = playwright.chromium.launch(headless=self.headless)
        self.context = self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )

    def _close_browser(self):
        """Close browser and context."""
        if self.context:
            self.context.close()
        if self.browser:
            self.browser.close()

    def _fetch_page(self, url: str, retries: int = None) -> Optional[Page]:
        """Fetch page with retries and rate limiting."""
        if retries is None:
            retries = self.max_retries
        
        self._rate_limit_wait()
        
        for attempt in range(retries):
            try:
                page = self.context.new_page()
                page.set_default_timeout(self.timeout)
                page.goto(url, wait_until='networkidle', timeout=self.timeout)
                return page
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1}/{retries} failed for {url}: {e}")
                if page:
                    page.close()
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"Failed to fetch {url} after {retries} attempts")
                    return None
        return None

    def parse_input(self, input_file: Path) -> List[Product]:
        """Parse markdown file and extract products."""
        logger.info(f"Parsing input file: {input_file}")
        products = []
        
        if not input_file.exists():
            logger.error(f"Input file not found: {input_file}")
            return products

        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract product lines (lines starting with number + dot or bullet)
        # Pattern: "1. Product Name", "1. Redken Product Name", etc.
        pattern = r'^\d+\.\s+(.+?)(?:\s*–\s*|\s*-\s*)?(\d+\s*(?:ml|g|kg|caps|sachets|pcs|amp\.?))?\s*$'
        
        for line in content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            # Try to match numbered list items
            match = re.match(r'^\d+\.\s+(.+)$', line)
            if match:
                product_name = match.group(1).strip()
                # Remove trailing dashes and extra info
                product_name = re.sub(r'\s*–\s*$', '', product_name)
                
                # Determine brand
                brand = "Thalion"
                if product_name.lower().startswith('redken'):
                    brand = "Redken"
                elif product_name.lower().startswith('thalisens'):
                    brand = "ThaliSens"
                elif product_name.lower().startswith("l'eau"):
                    brand = "Thalion"
                
                try:
                    product = Product(name=product_name, brand=brand)
                    products.append(product)
                    logger.debug(f"Parsed: {product.name} ({brand})")
                except Exception as e:
                    logger.warning(f"Failed to parse product from line: {line} - {e}")

        logger.info(f"Parsed {len(products)} products from input file")
        return products

    def crawl_thalion_category(self, category_url: str) -> List[ProductCandidate]:
        """Crawl Thalion category page (face or body)."""
        logger.info(f"Crawling Thalion category: {category_url}")
        candidates = []
        
        page = self._fetch_page(category_url)
        if not page:
            return candidates

        try:
            # Wait for content to load
            page.wait_for_load_state('networkidle')
            time.sleep(2)  # Extra wait for JS rendering
            
            html = page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            # Try multiple selectors for product cards
            selectors = [
                'a[href*="/product/"]',
                'a[href*="/en/"]',
                '.product-card',
                '.product-item',
                '[class*="product"]',
            ]
            
            found_links = set()
            for selector in selectors:
                elements = soup.select(selector)
                for elem in elements:
                    href = elem.get('href', '')
                    if not href:
                        continue
                    
                    # Get product URL
                    if href.startswith('/'):
                        product_url = urljoin(category_url, href)
                    elif href.startswith('http'):
                        product_url = href
                    else:
                        continue
                    
                    # Get product name
                    name = elem.get_text(strip=True)
                    if not name or len(name) < 3:
                        # Try to find name in child elements
                        name_elem = elem.find(['h1', 'h2', 'h3', 'h4', 'span', 'div'], class_=re.compile(r'name|title|product', re.I))
                        if name_elem:
                            name = name_elem.get_text(strip=True)
                    
                    if name and product_url not in found_links:
                        found_links.add(product_url)
                        candidates.append(ProductCandidate(
                            name=name,
                            url=product_url,
                            brand="Thalion"
                        ))
                        logger.debug(f"Found candidate: {name} -> {product_url}")

            # If no products found, log HTML snippet for debugging
            if not candidates:
                logger.warning(f"No products found on {category_url}")
                logger.debug(f"HTML snippet (first 2000 chars): {html[:2000]}")
            
        except Exception as e:
            logger.error(f"Error crawling Thalion category {category_url}: {e}")
        finally:
            page.close()

        logger.info(f"Found {len(candidates)} candidates from Thalion category")
        return candidates

    def crawl_redken_products(self, products_url: str) -> List[ProductCandidate]:
        """Crawl Redken products page (JS-heavy)."""
        logger.info(f"Crawling Redken products: {products_url}")
        candidates = []
        
        page = self._fetch_page(products_url)
        if not page:
            return candidates

        try:
            # Wait for JS to render
            page.wait_for_load_state('networkidle')
            time.sleep(3)  # Redken uses more JS
            
            # Try to scroll to load more products
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(2)
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(1)
            
            html = page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            # Try multiple selectors
            selectors = [
                'a[href*="/products/"]',
                'a[href*="/nl-nl/products/"]',
                '.product-link',
                '[class*="product"] a',
            ]
            
            found_links = set()
            for selector in selectors:
                elements = soup.select(selector)
                for elem in elements:
                    href = elem.get('href', '')
                    if not href:
                        continue
                    
                    if href.startswith('/'):
                        product_url = urljoin(products_url, href)
                    elif href.startswith('http'):
                        product_url = href
                    else:
                        continue
                    
                    name = elem.get_text(strip=True)
                    if not name or len(name) < 3:
                        name_elem = elem.find(['h1', 'h2', 'h3', 'h4', 'span', 'div'])
                        if name_elem:
                            name = name_elem.get_text(strip=True)
                    
                    if name and product_url not in found_links:
                        found_links.add(product_url)
                        candidates.append(ProductCandidate(
                            name=name,
                            url=product_url,
                            brand="Redken"
                        ))
                        logger.debug(f"Found candidate: {name} -> {product_url}")

            if not candidates:
                logger.warning(f"No products found on {products_url}")
                logger.debug(f"HTML snippet (first 2000 chars): {html[:2000]}")
                
        except Exception as e:
            logger.error(f"Error crawling Redken products {products_url}: {e}")
        finally:
            page.close()

        logger.info(f"Found {len(candidates)} candidates from Redken")
        return candidates

    def collect_candidates(self, brands: List[str]) -> List[ProductCandidate]:
        """Collect all product candidates from category pages."""
        all_candidates = []
        
        if "thalion" in brands or "all" in brands:
            thalion_urls = [
                "https://www.thalion.com/en/face/",
                "https://www.thalion.com/en/body/",
            ]
            for url in thalion_urls:
                candidates = self.crawl_thalion_category(url)
                all_candidates.extend(candidates)
        
        if "redken" in brands or "all" in brands:
            redken_url = "https://www.redken.eu/nl-nl/products"
            candidates = self.crawl_redken_products(redken_url)
            all_candidates.extend(candidates)
        
        # Deduplicate by URL
        seen_urls = set()
        unique_candidates = []
        for candidate in all_candidates:
            if candidate.url not in seen_urls:
                seen_urls.add(candidate.url)
                unique_candidates.append(candidate)
        
        logger.info(f"Total unique candidates: {len(unique_candidates)}")
        return unique_candidates

    def fetch_best_image(self, product_url: str) -> Tuple[Optional[str], str]:
        """Fetch the best image from a product page."""
        logger.debug(f"Fetching image from: {product_url}")
        
        page = self._fetch_page(product_url)
        if not page:
            return None, "page_load_failed"

        try:
            page.wait_for_load_state('networkidle')
            time.sleep(1)
            
            html = page.content()
            soup = BeautifulSoup(html, 'lxml')
            
            # Priority 1: og:image meta tag
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                og_url = og_image['content']
                if og_url.startswith('//'):
                    og_url = 'https:' + og_url
                elif og_url.startswith('/'):
                    og_url = urljoin(product_url, og_url)
                logger.debug(f"Found og:image: {og_url}")
                return og_url, "og:image"
            
            # Priority 2: Find img with largest srcset
            best_img = None
            best_width = 0
            best_source = "img_tag"
            
            imgs = soup.find_all('img')
            for img in imgs:
                # Check srcset
                srcset = img.get('srcset', '')
                if srcset:
                    # Parse srcset: "url1 400w, url2 800w" or "url1 1x, url2 2x"
                    sources = re.findall(r'([^\s,]+)\s+(\d+)([wx])', srcset)
                    for url, size, unit in sources:
                        width = int(size)
                        if unit == 'x':
                            width = width * 400  # Estimate: 1x = 400px base
                        
                        # Filter thumbnails
                        if width >= 400 and width > best_width:
                            if url.startswith('//'):
                                url = 'https:' + url
                            elif url.startswith('/'):
                                url = urljoin(product_url, url)
                            best_img = url
                            best_width = width
                            best_source = "srcset"
                
                # Check regular src
                src = img.get('src', '')
                if src and not best_img:
                    # Check if it looks like a product image (not icon/logo)
                    if any(x in src.lower() for x in ['product', 'packshot', 'pack', 'image']):
                        if src.startswith('//'):
                            src = 'https:' + src
                        elif src.startswith('/'):
                            src = urljoin(product_url, src)
                        best_img = src
                        best_source = "img_tag"
            
            if best_img:
                logger.debug(f"Found best image: {best_img} (width: {best_width}, source: {best_source})")
                return best_img, best_source
            
            # Priority 3: Look for common image URL patterns in page
            # This is a fallback - look for URLs that might be images
            all_urls = re.findall(r'(https?://[^\s"\'<>]+\.(?:jpg|jpeg|png|webp))', html, re.IGNORECASE)
            if all_urls:
                # Filter for product-like URLs
                product_urls = [url for url in all_urls if any(x in url.lower() for x in ['product', 'pack', 'image'])]
                if product_urls:
                    logger.debug(f"Found image from URL pattern: {product_urls[0]}")
                    return product_urls[0], "url_pattern"
            
            logger.warning(f"No image found on {product_url}")
            return None, "not_found"
            
        except Exception as e:
            logger.error(f"Error fetching image from {product_url}: {e}")
            return None, f"error: {str(e)}"
        finally:
            page.close()

    def match_products(
        self,
        products: List[Product],
        candidates: List[ProductCandidate]
    ) -> List[PackshotResult]:
        """Match products with candidates using fuzzy matching."""
        logger.info(f"Matching {len(products)} products with {len(candidates)} candidates")
        results = []
        
        # Create lookup dict for candidates by normalized name
        candidate_dict = {}
        for candidate in candidates:
            normalized = Product._normalize_name(candidate.name)
            if normalized not in candidate_dict:
                candidate_dict[normalized] = []
            candidate_dict[normalized].append(candidate)
        
        # Match each product
        for product in products:
            logger.debug(f"Matching product: {product.name}")
            
            # Try exact match first
            matched_candidate = None
            if product.normalized_name in candidate_dict:
                matched_candidate = candidate_dict[product.normalized_name][0]
                score = 100
            else:
                # Fuzzy match
                candidate_names = [c.name for c in candidates if c.brand == product.brand]
                if candidate_names:
                    match_result = process.extractOne(
                        product.name,
                        candidate_names,
                        scorer=fuzz.WRatio,
                        score_cutoff=self.min_score
                    )
                    if match_result:
                        matched_name, score, _ = match_result
                        # Find candidate with this name
                        matched_candidate = next(
                            (c for c in candidates if c.name == matched_name and c.brand == product.brand),
                            None
                        )
            
            if matched_candidate:
                # Fetch image
                image_url, image_source = self.fetch_best_image(matched_candidate.url)
                
                if image_url:
                    result = PackshotResult(
                        product_name=product.name,
                        brand=product.brand,
                        normalized_name=product.normalized_name,
                        size_ml=product.size_ml,
                        product_page_url=matched_candidate.url,
                        image_url=image_url,
                        image_source=image_source,
                        status="found",
                        notes=f"Match score: {score}"
                    )
                else:
                    result = PackshotResult(
                        product_name=product.name,
                        brand=product.brand,
                        normalized_name=product.normalized_name,
                        size_ml=product.size_ml,
                        product_page_url=matched_candidate.url,
                        image_url="",
                        image_source=image_source,
                        status="no_image",
                        notes=f"Match score: {score}, but no image found"
                    )
            else:
                result = PackshotResult(
                    product_name=product.name,
                    brand=product.brand,
                    normalized_name=product.normalized_name,
                    size_ml=product.size_ml,
                    product_page_url="",
                    image_url="",
                    image_source="",
                    status="not_found",
                    notes="No matching candidate found"
                )
            
            results.append(result)
            logger.info(f"Product: {product.name} -> Status: {result.status}")
        
        return results

    def write_csv(self, results: List[PackshotResult], output_file: Path):
        """Write results to CSV."""
        logger.info(f"Writing results to {output_file}")
        
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'product_name', 'brand', 'normalized_name', 'size_ml',
                'product_page_url', 'image_url', 'image_source', 'status', 'notes'
            ])
            
            for result in results:
                writer.writerow([
                    result.product_name,
                    result.brand,
                    result.normalized_name,
                    result.size_ml or '',
                    result.product_page_url,
                    result.image_url,
                    result.image_source,
                    result.status,
                    result.notes
                ])
        
        logger.info(f"Wrote {len(results)} results to {output_file}")

    def write_not_found(self, results: List[PackshotResult], output_file: Path):
        """Write not found products to separate CSV."""
        not_found = [r for r in results if r.status == "not_found"]
        
        if not not_found:
            logger.info("No not_found products to write")
            return
        
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['product_name', 'brand', 'normalized_name', 'notes'])
            
            for result in not_found:
                writer.writerow([
                    result.product_name,
                    result.brand,
                    result.normalized_name,
                    result.notes
                ])
        
        logger.info(f"Wrote {len(not_found)} not_found products to {output_file}")

    def run(
        self,
        input_file: Path,
        output_file: Path,
        brands: List[str],
        limit: Optional[int] = None
    ):
        """Main run method."""
        logger.info("Starting packshot crawler")
        
        # Parse input
        products = self.parse_input(input_file)
        if limit:
            products = products[:limit]
            logger.info(f"Limited to {limit} products")
        
        # Setup browser
        self._setup_browser()
        
        try:
            # Collect candidates
            candidates = self.collect_candidates(brands)
            
            # Match products
            results = self.match_products(products, candidates)
            
            # Write output
            self.write_csv(results, output_file)
            self.write_not_found(results, output_file.parent / "not_found.csv")
            
            # Summary
            found = sum(1 for r in results if r.status == "found")
            not_found = sum(1 for r in results if r.status == "not_found")
            no_image = sum(1 for r in results if r.status == "no_image")
            
            logger.info("=" * 60)
            logger.info("SUMMARY")
            logger.info(f"Total products: {len(results)}")
            logger.info(f"Found with image: {found}")
            logger.info(f"No image found: {no_image}")
            logger.info(f"Not found: {not_found}")
            logger.info("=" * 60)
            
        finally:
            self._close_browser()


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Packshot URL Collector for Thalion and Redken products'
    )
    parser.add_argument(
        '--input',
        type=Path,
        default=Path('SHOP_PRODUCTEN_LIJST.md'),
        help='Input markdown file with product list'
    )
    parser.add_argument(
        '--out',
        type=Path,
        default=Path('output/packshots.csv'),
        help='Output CSV file'
    )
    parser.add_argument(
        '--headful',
        action='store_true',
        help='Run browser in headful mode (for debugging)'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Limit number of products to process'
    )
    parser.add_argument(
        '--brand',
        type=str,
        default='all',
        choices=['thalion', 'redken', 'all'],
        help='Brand to crawl (default: all)'
    )
    parser.add_argument(
        '--min-score',
        type=int,
        default=80,
        help='Minimum fuzzy match score (0-100, default: 80)'
    )
    
    args = parser.parse_args()
    
    # Ensure output directory exists
    args.out.parent.mkdir(parents=True, exist_ok=True)
    Path('output').mkdir(exist_ok=True)
    
    # Create crawler
    crawler = PackshotCrawler(
        headless=not args.headful,
        min_score=args.min_score
    )
    
    # Run
    brands = [args.brand] if args.brand != 'all' else ['all']
    crawler.run(
        input_file=args.input,
        output_file=args.out,
        brands=brands,
        limit=args.limit
    )


if __name__ == '__main__':
    main()
