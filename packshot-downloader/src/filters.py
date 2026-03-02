"""Filters for image search results."""
from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class ImageResult:
    """Image search result."""
    url: str
    width: Optional[int] = None
    height: Optional[int] = None
    content_size: Optional[int] = None
    content_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    encoding_format: Optional[str] = None
    name: Optional[str] = None
    product_name: Optional[str] = None


def filter_by_dimensions(results: List[ImageResult], min_dimension: int = 1200) -> List[ImageResult]:
    """Filter results by minimum dimension (width or height)."""
    # If results are already ImageResult objects, just filter them
    if results and isinstance(results[0], ImageResult):
        filtered = []
        for result in results:
            # If dimensions unknown, accept (will check after download)
            if result.width is None and result.height is None:
                filtered.append(result)
            elif (result.width and result.width >= min_dimension) or (result.height and result.height >= min_dimension):
                filtered.append(result)
        return filtered
    
    # Legacy: handle dict results (from Bing API)
    filtered = []
    for result in results:
        width = result.get('width', 0)
        height = result.get('height', 0)
        
        # Accept if either dimension meets minimum
        if width >= min_dimension or height >= min_dimension:
            filtered.append(ImageResult(
                url=result.get('contentUrl', ''),
                width=width,
                height=height,
                content_size=result.get('contentSize'),
                content_url=result.get('contentUrl'),
                thumbnail_url=result.get('thumbnailUrl'),
                encoding_format=result.get('encodingFormat'),
                name=result.get('name')
            ))
    
    return filtered


def prioritize_results(results: List[ImageResult]) -> List[ImageResult]:
    """Prioritize results: prefer photos, larger images, then by total pixels."""
    # Sort by: photo type first, then by total pixels (width * height)
    def sort_key(img: ImageResult) -> tuple:
        # Prefer "photo" type (we'll check encoding format or name)
        is_photo = (
            img.encoding_format and 'jpeg' in img.encoding_format.lower()
        ) or (
            img.name and 'photo' in img.name.lower()
        )
        
        total_pixels = img.width * img.height
        
        return (
            not is_photo,  # False (photo) sorts before True (non-photo)
            -total_pixels  # Negative for descending order
        )
    
    return sorted(results, key=sort_key)


def select_best_results(results: List[ImageResult], max_count: int = 3, 
                        perfect_threshold: int = 2000) -> List[ImageResult]:
    """Select best results, stopping early if perfect match found."""
    if not results:
        return []
    
    prioritized = prioritize_results(results)
    selected = []
    
    for img in prioritized:
        # Check if this is a "perfect" match (high resolution)
        is_perfect = img.width >= perfect_threshold and img.height >= perfect_threshold
        
        selected.append(img)
        
        # Stop early if we found a perfect match and have at least one image
        if is_perfect and len(selected) >= 1:
            break
        
        # Stop if we have enough
        if len(selected) >= max_count:
            break
    
    return selected
