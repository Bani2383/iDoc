import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholder,
  width,
  height,
  onLoad,
  onError,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer
    if (!imageRef) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image is visible
      }
    );

    observerRef.current.observe(imageRef);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [imageRef, src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Image non disponible</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={setImageRef}
        src={imageSrc || placeholder}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}

// Optimized image component with automatic format conversion
export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
}: LazyImageProps) {
  // Convert to WebP if browser supports it
  const getOptimizedSrc = (originalSrc: string): string => {
    if (!originalSrc) return '';

    // Check if it's a Pexels image or external URL
    if (originalSrc.includes('pexels.com') || originalSrc.includes('http')) {
      // Add query parameters for optimization
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}auto=compress&cs=tinysrgb&w=${width || 800}`;
    }

    return originalSrc;
  };

  return (
    <LazyImage
      src={getOptimizedSrc(src)}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
}

// Background image with lazy loading
export function LazyBackgroundImage({
  src,
  children,
  className = '',
}: {
  src: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [imageRef, setImageRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = src;
            img.onload = () => setLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef, src]);

  return (
    <div
      ref={setImageRef}
      className={`${className} ${loaded ? '' : 'bg-gray-200 animate-pulse'}`}
      style={
        loaded
          ? {
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
