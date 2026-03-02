"""Bing Image Search API integration."""
import os
import asyncio
import aiohttp
from typing import List, Dict, Optional
from dataclasses import dataclass
import time


@dataclass
class SearchQuery:
    """Search query configuration."""
    product_name: str
    brand: str
    line: str


class BingImageSearcher:
    """Bing Image Search API client with rate limiting."""
    
    def __init__(self, api_key: str, endpoint: str = "https://api.bing.microsoft.com/v7.0/images/search"):
        self.api_key = api_key
        self.endpoint = endpoint
        self.session: Optional[aiohttp.ClientSession] = None
        self.last_request_time = 0.0
        self.min_request_interval = 0.2  # 5 requests per second max
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def _rate_limit(self):
        """Enforce rate limiting."""
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < self.min_request_interval:
            await asyncio.sleep(self.min_request_interval - elapsed)
        self.last_request_time = time.time()
    
    def build_queries(self, product: SearchQuery) -> List[str]:
        """Build multiple search queries for a product."""
        queries = []
        
        # Query 1: Product name + packshot
        queries.append(f"{product.product_name} packshot")
        
        # Query 2: Product name + product image white background
        queries.append(f"{product.product_name} product image white background")
        
        # Query 3: Brand + line + type + size + packshot (if we can extract type)
        # Extract type (shampoo, conditioner, serum, etc.)
        product_lower = product.product_name.lower()
        type_keywords = []
        for keyword in ['shampoo', 'conditioner', 'serum', 'cream', 'mask', 'masker', 
                       'lotion', 'oil', 'spray', 'mist', 'gel', 'cleanser', 'tonic',
                       'scrub', 'caps', 'tea', 'sachets']:
            if keyword in product_lower:
                type_keywords.append(keyword)
                break
        
        if type_keywords and product.line != 'Unknown':
            type_word = type_keywords[0]
            # Extract size if present
            size_match = None
            for size_pattern in [r'(\d+\s*ml)', r'(\d+\s*caps)', r'(\d+\s*sachets)']:
                import re
                match = re.search(size_pattern, product.product_name, re.IGNORECASE)
                if match:
                    size_match = match.group(1)
                    break
            
            query_parts = [product.brand, product.line, type_word]
            if size_match:
                query_parts.append(size_match)
            query_parts.append('packshot')
            queries.append(' '.join(query_parts))
        
        return queries
    
    async def search(self, product: SearchQuery, min_dimension: int = 1200) -> List[Dict]:
        """Search for images of a product."""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async context manager.")
        
        queries = self.build_queries(product)
        all_results = []
        
        for query in queries:
            await self._rate_limit()
            
            try:
                headers = {
                    'Ocp-Apim-Subscription-Key': self.api_key
                }
                params = {
                    'q': query,
                    'count': 50,  # Max results per query
                    'imageType': 'Photo',  # Prefer photos
                    'size': 'Large',  # Prefer large images
                    'aspect': 'Wide',  # Prefer wide (packshots are usually wide)
                    'color': 'ColorOnly',
                    'license': 'All',  # We'll respect usage rights
                }
                
                async with self.session.get(
                    self.endpoint,
                    headers=headers,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        results = data.get('value', [])
                        all_results.extend(results)
                    elif response.status == 429:
                        # Rate limited - wait longer
                        await asyncio.sleep(1)
                    else:
                        # Log error but continue
                        error_text = await response.text()
                        print(f"  ⚠️  Query '{query}' failed: {response.status} - {error_text[:100]}")
            
            except asyncio.TimeoutError:
                print(f"  ⚠️  Query '{query}' timed out")
            except Exception as e:
                print(f"  ⚠️  Query '{query}' error: {str(e)[:100]}")
        
        # Deduplicate by contentUrl
        seen_urls = set()
        unique_results = []
        for result in all_results:
            url = result.get('contentUrl', '')
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique_results.append(result)
        
        return unique_results
