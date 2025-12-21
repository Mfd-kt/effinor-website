'use client';

import { useState } from 'react';
import { ProductImage } from '@/lib/products';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Si pas d'images, afficher un placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-[#F3F4F6] rounded-lg flex items-center justify-center">
        <p className="text-[#9CA3AF]">Aucune image disponible</p>
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex] || images[0];

  return (
    <div className="w-full">
      {/* Image principale */}
      <div className="w-full aspect-square bg-[#F3F4F6] rounded-lg overflow-hidden mb-4">
        <img
          src={selectedImage.imageUrl}
          alt={selectedImage.alt || productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-[#10B981] ring-2 ring-[#10B981]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <img
                src={image.imageUrl}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}






