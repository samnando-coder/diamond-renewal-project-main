#!/usr/bin/env python3
"""Main entry point for product packshot downloader."""
import os
import sys
import argparse
import asyncio
import csv
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv
from tqdm import tqdm

from src.parser import parse_markdown_file, Product
from src.scraper import WebsiteScraper, ImageResult as ScraperImageResult
from src.search import BingImageSearcher, SearchQuery
from src.filters import filter_by_dimensions, select_best_results, ImageResult as FilterImageResult
from src.downloader import ImageDownloader
from src.utils import normalize_product_name


def _convert_scraper_to_filter_result(scraper_result: ScraperImageResult) -> FilterImageResult:
    """Convert scraper ImageResult to filter ImageResult."""
    return FilterImageResult(
        url=scraper_result.url,
        width=scraper_result.width,
        height=scraper_result.height,
        product_name=scraper_result.product_name
    )


async def process_product(
    product: Product,
    bing_searcher: Optional[BingImageSearcher],
    scraper: WebsiteScraper,
    downloader: ImageDownloader,
    min_dimension: int,
    max_per_product: int,
    dry_run: bool,
    csv_writer=None
) -> dict:
    """Process a single product: search and download images."""
    product_name = product.name
    brand = product.brand
    line = product.line
    
    result = {
        'product': product_name,
        'brand': brand,
        'line': line,
        'success': False,
        'images_downloaded': 0,
        'queries': [],
        'download_results': [],
        'errors': []
    }
    
    try:
        search_results = []
        search_method = None
        
        # Strategy 1: Try Bing Image Search API first (if available)
        if bing_searcher:
            if dry_run:
                result['queries'].append(f"Bing: '{product_name} packshot'")
                print(f"  Would search Bing for: '{product_name}'")
            else:
                try:
                    search_query = SearchQuery(
                        product_name=product_name,
                        brand=brand,
                        line=line
                    )
                    bing_results = await bing_searcher.search(search_query, min_dimension)
                    
                    if bing_results:
                        # Convert Bing dict results to FilterImageResult
                        for bing_result in bing_results:
                            filter_result = FilterImageResult(
                                url=bing_result.get('contentUrl', ''),
                                width=bing_result.get('width', 0),
                                height=bing_result.get('height', 0),
                                content_size=bing_result.get('contentSize'),
                                content_url=bing_result.get('contentUrl'),
                                thumbnail_url=bing_result.get('thumbnailUrl'),
                                encoding_format=bing_result.get('encodingFormat'),
                                name=bing_result.get('name'),
                                product_name=product_name
                            )
                            search_results.append(filter_result)
                        
                        if search_results:
                            search_method = "Bing Image Search"
                            result['queries'].append(f"Bing: '{product_name} packshot'")
                except Exception as e:
                    result['errors'].append(f"Bing search error: {str(e)[:100]}")
        
        # Strategy 2: Fallback to website scraping
        if not search_results:
            if dry_run:
                result['queries'].append(f"Scraping {brand} website")
                print(f"  Would scrape: {brand} website for '{product_name}'")
            else:
                try:
                    scraper_results = await scraper.search(product_name, brand)
                    
                    if scraper_results:
                        # Convert scraper results to filter results
                        for sr in scraper_results:
                            search_results.append(_convert_scraper_to_filter_result(sr))
                        
                        if search_results:
                            search_method = f"{brand} website"
                            result['queries'].append(f"Scraping {brand} website")
                except Exception as e:
                    result['errors'].append(f"Website scraping error: {str(e)[:100]}")
        
        if not search_results:
            result['errors'].append(f"No images found via {search_method or 'any method'}")
            return result
        
        # Filter by dimensions
        filtered = filter_by_dimensions(search_results, min_dimension)
        
        if not filtered:
            result['errors'].append(f"No images found meeting minimum dimension ({min_dimension}px)")
            return result
        
        # Select best results
        selected = select_best_results(filtered, max_count=max_per_product)
        
        if not selected:
            result['errors'].append("No suitable images selected after filtering")
            return result
        
        # Download images
        download_results = await downloader.download_multiple(
            selected, product_name, brand, line
        )
        result['download_results'] = download_results
        
        # Count successful downloads
        successful = [r for r in download_results if r.success]
        result['images_downloaded'] = len(successful)
        result['success'] = len(successful) > 0
        
        # Write to CSV
        if csv_writer:
            for dr in download_results:
                if dr.success:
                    csv_writer.writerow([
                        product_name,
                        brand,
                        line,
                        search_method or 'Unknown',
                        dr.image_url,
                        str(dr.local_path) if dr.local_path else '',
                        dr.width or '',
                        dr.height or '',
                        dr.file_size or '',
                        dr.sha256 or '',
                        'Yes' if dr.has_white_background else 'No'
                    ])
        
        # Collect errors
        for dr in download_results:
            if not dr.success and dr.error:
                result['errors'].append(dr.error)
        
        return result
    
    except Exception as e:
        result['errors'].append(str(e)[:200])
        return result


async def process_all_products(
    products: List[Product],
    bing: Optional[BingImageSearcher],
    scraper: WebsiteScraper,
    downloader: ImageDownloader,
    args,
    csv_writer,
    failed_file
):
    """Process all products with progress bar."""
    successful_count = 0
    failed_count = 0
    total_images = 0
    
    with tqdm(total=len(products), desc="Processing products") as pbar:
        for product in products:
            pbar.set_description(f"Processing: {product.name[:40]}")
            
            result = await process_product(
                product, bing, scraper, downloader,
                args.min_dim, args.per_product, args.dry_run, csv_writer
            )
            
            if result['success']:
                successful_count += 1
                total_images += result['images_downloaded']
            else:
                failed_count += 1
                failed_file.write(f"{product.name} ({product.brand} - {product.line})\n")
                if result['errors']:
                    failed_file.write(f"  Errors: {', '.join(result['errors'])}\n")
                failed_file.write("\n")
            
            pbar.update(1)
    
    return successful_count, failed_count, total_images


async def main_async(args):
    """Main async function."""
    # Load environment variables
    load_dotenv()
    
    # Parse input file
    input_file = Path(args.input)
    if not input_file.exists():
        print(f"[ERROR] Input file not found: {input_file}")
        sys.exit(1)
    
    print(f"Parsing {input_file}...")
    products = parse_markdown_file(input_file)
    print(f"Found {len(products)} products\n")
    
    # Check for Bing API key
    bing_api_key = os.getenv('BING_SEARCH_KEY')
    bing_endpoint = os.getenv('BING_SEARCH_ENDPOINT', 'https://api.bing.microsoft.com/v7.0/images/search')
    
    if bing_api_key:
        print("[OK] Bing Image Search API key found - will use Bing as primary search method")
        print("     Fallback: Official brand websites\n")
    else:
        print("[WARN] No Bing API key found (BING_SEARCH_KEY)")
        print("       Using official brand websites only:")
        print("       - Redken: https://www.redken.eu/nl-nl")
        print("       - Thalion: https://www.thalion.com/en/")
        print("       Tip: Set BING_SEARCH_KEY in .env for better results\n")
    
    if args.dry_run:
        print("DRY RUN MODE - No downloads will be performed\n")
        for i, product in enumerate(products[:10], 1):  # Show first 10
            print(f"{i}. {product.name} ({product.brand} - {product.line})")
        if len(products) > 10:
            print(f"... and {len(products) - 10} more")
        return
    
    # Setup output directory
    output_dir = Path(args.outdir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Setup CSV and failed files
    csv_path = output_dir / 'results.csv'
    failed_path = output_dir / 'failed.txt'
    
    csv_file = open(csv_path, 'w', newline='', encoding='utf-8')
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow([
        'product', 'brand', 'line', 'query', 'image_url', 'local_path',
        'width', 'height', 'file_size', 'sha256', 'has_white_background'
    ])
    
    failed_file = open(failed_path, 'w', encoding='utf-8')
    
    # Initialize searchers and downloader
    bing_searcher = None
    if bing_api_key:
        bing_searcher = BingImageSearcher(bing_api_key, bing_endpoint)
    
    # Use conditional context manager for Bing
    if bing_searcher:
        async with bing_searcher as bing, \
                 WebsiteScraper(max_concurrent=args.concurrency) as scraper, \
                 ImageDownloader(output_dir, max_concurrent=args.concurrency) as downloader:
            successful_count, failed_count, total_images = await process_all_products(
                products, bing, scraper, downloader, args, csv_writer, failed_file
            )
    else:
        async with WebsiteScraper(max_concurrent=args.concurrency) as scraper, \
                 ImageDownloader(output_dir, max_concurrent=args.concurrency) as downloader:
            successful_count, failed_count, total_images = await process_all_products(
                products, None, scraper, downloader, args, csv_writer, failed_file
            )
    
    csv_file.close()
    failed_file.close()
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total products:     {len(products)}")
    print(f"Successful:         {successful_count}")
    print(f"Failed:             {failed_count}")
    print(f"Total images:       {total_images}")
    print(f"\nResults CSV:        {csv_path}")
    print(f"Failed products:    {failed_path}")
    print(f"Output directory:   {output_dir}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Download product packshot images in bulk from official brand websites'
    )
    parser.add_argument(
        '--input',
        type=str,
        default='SHOP_PRODUCTEN_LIJST.md',
        help='Input markdown file with product list (default: SHOP_PRODUCTEN_LIJST.md)'
    )
    parser.add_argument(
        '--outdir',
        type=str,
        default='output',
        help='Output directory (default: output)'
    )
    parser.add_argument(
        '--per-product',
        type=int,
        default=3,
        help='Maximum images per product (default: 3)'
    )
    parser.add_argument(
        '--min-dim',
        type=int,
        default=1200,
        help='Minimum dimension (width or height) in pixels (default: 1200)'
    )
    parser.add_argument(
        '--concurrency',
        type=int,
        default=3,
        help='Maximum concurrent downloads (default: 3)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be searched without downloading'
    )
    
    args = parser.parse_args()
    
    # Run async main
    asyncio.run(main_async(args))


if __name__ == '__main__':
    main()
