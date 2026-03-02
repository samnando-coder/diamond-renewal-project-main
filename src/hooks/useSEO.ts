import { useEffect } from "react";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export function useSEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    const baseTitle = "Blue Diamonds Club";
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    
    // Update title
    document.title = fullTitle;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        if (isProperty) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    
    if (description) {
      updateMeta("description", description);
      updateMeta("og:description", description, true);
    }
    
    if (title) {
      updateMeta("og:title", fullTitle, true);
    }
    
    if (image) {
      updateMeta("og:image", image, true);
    }
    
    if (url) {
      updateMeta("og:url", url, true);
    }
  }, [title, description, image, url]);
}
