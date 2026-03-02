"""Image downloader with concurrency control and deduplication."""
import asyncio
import aiohttp
from pathlib import Path
from typing import List, Optional, Set
from dataclasses import dataclass
import hashlib
from src.filters import ImageResult
from src.utils import calculate_file_hash, check_white_background, get_image_dimensions, get_file_size, normalize_product_name


@dataclass
class DownloadResult:
    """Result of image download."""
    success: bool
    image_url: str
    local_path: Optional[Path] = None
    width: Optional[int] = None
    height: Optional[int] = None
    file_size: Optional[int] = None
    sha256: Optional[str] = None
    has_white_background: bool = False
    error: Optional[str] = None


class ImageDownloader:
    """Download images with concurrency control and deduplication."""
    
    def __init__(self, output_dir: Path, max_concurrent: int = 3):
        self.output_dir = output_dir
        self.max_concurrent = max_concurrent
        self.session: Optional[aiohttp.ClientSession] = None
        self.seen_hashes: Set[str] = set()
        self.semaphore = asyncio.Semaphore(max_concurrent)
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def download_image(self, image, product_name: str, 
                           brand: str, line: str, index: int) -> DownloadResult:
        """Download a single image."""
        async with self.semaphore:
            return await self._download_image_internal(image, product_name, brand, line, index)
    
    async def _download_image_internal(self, image, product_name: str,
                                     brand: str, line: str, index: int) -> DownloadResult:
        """Internal download implementation."""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async context manager.")
        
        # Determine file extension from URL
        url = getattr(image, 'content_url', None) or getattr(image, 'url', None) or image.url
        ext = 'jpg'
        if hasattr(image, 'encoding_format') and image.encoding_format:
            ext = image.encoding_format.lower().replace('jpeg', 'jpg')
        elif url:
            if '.png' in url.lower():
                ext = 'png'
            elif '.webp' in url.lower():
                ext = 'webp'
            elif '.gif' in url.lower():
                ext = 'gif'
        
        # Create directory structure
        normalized_name = normalize_product_name(product_name)
        # Sanitize line name for filesystem
        line_safe = line.replace('/', '-').replace('\\', '-')
        product_dir = self.output_dir / brand / line_safe / normalized_name
        product_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = product_dir / f"{index}.{ext}"
        
        try:
            # Download image
            async with self.session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=30),
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            ) as response:
                if response.status != 200:
                    return DownloadResult(
                        success=False,
                        image_url=url,
                        error=f"HTTP {response.status}"
                    )
                
                # Read image data
                image_data = await response.read()
                
                # Calculate hash before saving
                sha256 = hashlib.sha256(image_data).hexdigest()
                
                # Check for duplicates
                if sha256 in self.seen_hashes:
                    return DownloadResult(
                        success=False,
                        image_url=url,
                        error="Duplicate (same hash already downloaded)"
                    )
                
                # Save file
                with open(file_path, 'wb') as f:
                    f.write(image_data)
                
                # Verify it's a valid image and get dimensions
                dimensions = get_image_dimensions(file_path)
                if not dimensions:
                    file_path.unlink()  # Delete invalid image
                    return DownloadResult(
                        success=False,
                        image_url=url,
                        error="Invalid image file"
                    )
                
                width, height = dimensions
                file_size = get_file_size(file_path)
                
                # Check white background
                has_white_bg = check_white_background(file_path)
                
                # Mark hash as seen
                self.seen_hashes.add(sha256)
                
                return DownloadResult(
                    success=True,
                    image_url=url,
                    local_path=file_path,
                    width=width,
                    height=height,
                    file_size=file_size,
                    sha256=sha256,
                    has_white_background=has_white_bg
                )
        
        except asyncio.TimeoutError:
            return DownloadResult(
                success=False,
                image_url=url,
                error="Download timeout"
            )
        except Exception as e:
            return DownloadResult(
                success=False,
                image_url=url,
                error=str(e)[:200]
            )
    
    async def download_multiple(self, images: List, product_name: str,
                               brand: str, line: str) -> List[DownloadResult]:
        """Download multiple images for a product."""
        tasks = []
        for index, image in enumerate(images, start=1):
            task = self.download_image(image, product_name, brand, line, index)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Convert exceptions to failed results
        download_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                img_url = getattr(images[i], 'url', None) or images[i].url if hasattr(images[i], 'url') else 'unknown'
                download_results.append(DownloadResult(
                    success=False,
                    image_url=img_url,
                    error=str(result)[:200]
                ))
            else:
                download_results.append(result)
        
        return download_results
