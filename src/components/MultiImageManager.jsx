import React, { useState } from 'react';
import { Upload, Plus, Trash2, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { uploadImageFileToStorage } from '../firebase';

/**
 * High-Speed Universal Image Processor
 * 1. Checks Firebase Storage with circuit-breaker timeout
 * 2. Falls back to ultra-fast native Canvas WebP/JPEG compression using ObjectURL (under 50ms)
 */
async function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.72) {
  // First attempt: Direct Firebase Storage upload (guarded with 1.5s circuit breaker)
  try {
    const storageUrl = await uploadImageFileToStorage(file, "gallery");
    if (storageUrl) {
      return storageUrl;
    }
  } catch (err) {
    // Quick bypass to instant local canvas
  }

  // Second attempt: Lightning-fast Canvas WebP/JPEG compression using Blob URL
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Maintain aspect ratio within 800px bounds
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first for optimal ~25KB compact output, fallback to JPEG
      try {
        const dataUrl = canvas.toDataURL('image/webp', quality);
        if (dataUrl && dataUrl.startsWith('data:image/webp') && dataUrl.length > 50) {
          resolve(dataUrl);
          return;
        }
      } catch {}

      try {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback to FileReader if ObjectURL fails on older environments
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Downscales an existing base64 data URL to fit within compact byte boundaries
 */
export async function downscaleDataUrl(dataUrl, maxDim = 650, quality = 0.62) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const result = canvas.toDataURL('image/webp', quality);
        if (result && result.length > 50) return resolve(result);
      } catch {}

      try {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function MultiImageManager({
  images = [],
  onChange,
  onDeleteImage,
  label = "Background Images (Slider / Carousel)",
  helperText = "Upload multiple images or paste image URLs. You can upload as many images as you like with no limits. They will smoothly crossfade automatically on the page."
}) {
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const imageList = Array.isArray(images) ? images.filter(Boolean) : (images ? [images] : []);

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const newUrl = urlInput.trim();
    if (!imageList.includes(newUrl)) {
      onChange([...imageList, newUrl]);
    }
    setUrlInput('');
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessingFile(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      let completedCount = 0;
      // Parallel fast processing for all files at once
      const compressedResults = await Promise.all(
        files.map(async (file) => {
          const res = await compressImageFile(file);
          completedCount++;
          setUploadProgress({ current: completedCount, total: files.length });
          return res;
        })
      );

      const validResults = compressedResults.filter(Boolean);
      if (validResults.length > 0) {
        const combined = [...imageList, ...validResults];
        const totalBase64Len = combined.reduce((acc, str) => acc + (typeof str === 'string' && str.startsWith('data:') ? str.length : 0), 0);
        if (totalBase64Len > 650000) {
          const optimized = await Promise.all(combined.map(async (img) => {
            if (typeof img === 'string' && img.startsWith('data:image/') && img.length > 60000) {
              return await downscaleDataUrl(img, 650, 0.62);
            }
            return img;
          }));
          onChange(optimized);
        } else {
          onChange(combined);
        }
      }
    } catch (err) {
      console.error("Error processing uploaded images:", err);
    } finally {
      setIsProcessingFile(false);
      setUploadProgress(null);
      // Clear input value so same files can be re-selected if needed
      if (e.target) e.target.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setIsProcessingFile(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      let completedCount = 0;
      // Parallel fast processing for all files at once
      const compressedResults = await Promise.all(
        files.map(async (file) => {
          const res = await compressImageFile(file);
          completedCount++;
          setUploadProgress({ current: completedCount, total: files.length });
          return res;
        })
      );

      const validResults = compressedResults.filter(Boolean);
      if (validResults.length > 0) {
        const combined = [...imageList, ...validResults];
        const totalBase64Len = combined.reduce((acc, str) => acc + (typeof str === 'string' && str.startsWith('data:') ? str.length : 0), 0);
        if (totalBase64Len > 650000) {
          const optimized = await Promise.all(combined.map(async (img) => {
            if (typeof img === 'string' && img.startsWith('data:image/') && img.length > 60000) {
              return await downscaleDataUrl(img, 650, 0.62);
            }
            return img;
          }));
          onChange(optimized);
        } else {
          onChange(combined);
        }
      }
    } catch (err) {
      console.error("Error processing dropped images:", err);
    } finally {
      setIsProcessingFile(false);
      setUploadProgress(null);
    }
  };

  const handleRemove = async (indexToRemove) => {
    const imgToRemove = imageList[indexToRemove];
    if (!window.confirm(`Delete image #${indexToRemove + 1}? It will be removed from the database.`)) {
      return;
    }

    const updated = imageList.filter((_, idx) => idx !== indexToRemove);
    setDeletingIndex(indexToRemove);
    try {
      onChange(updated);
      if (typeof onDeleteImage === 'function') {
        await onDeleteImage(imgToRemove, updated);
      }
    } catch (err) {
      console.error("Error deleting image from database:", err);
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete all uploaded images? They will be removed from the database.")) {
      setDeletingIndex('all');
      try {
        onChange([]);
        if (typeof onDeleteImage === 'function') {
          await onDeleteImage(null, []);
        }
      } catch (err) {
        console.error("Error clearing images from database:", err);
      } finally {
        setDeletingIndex(null);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-black/30 border transition-colors rounded-2xl p-4 sm:p-5 space-y-3.5 font-inter ${
        isDragging ? 'border-[#fdb927] bg-[#fdb927]/10' : 'border-[#fdb927]/30'
      }`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#fdb927]" />
            <span>{label}</span>
          </label>
          {helperText && (
            <p className="text-[10px] sm:text-[11px] text-white/60 mt-0.5 max-w-xl">
              {helperText}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {imageList.length > 1 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[10px] text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
            >
              Clear All
            </button>
          )}

          <span className="text-[10px] font-bold text-[#fdb927] bg-[#fdb927]/15 px-2.5 py-0.5 rounded-full border border-[#fdb927]/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#fdb927]" />
            <span>{imageList.length} {imageList.length === 1 ? 'Image' : 'Images'} (Unlimited)</span>
          </span>
        </div>
      </div>

      {/* Existing Images Thumbnail Grid */}
      {imageList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 pt-1">
          {imageList.map((imgSrc, idx) => (
            <div
              key={idx}
              className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border-2 border-[#fdb927]/40 bg-black/50 group shadow-md"
            >
              <img
                src={imgSrc}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="absolute top-1 left-1 bg-black/80 text-[#fdb927] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                #{idx + 1}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                disabled={deletingIndex === idx}
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-1 sm:p-1.5 bg-red-600/95 hover:bg-red-600 text-white rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow z-10 disabled:opacity-75"
                title="Delete this image from database"
              >
                {deletingIndex === idx ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add More Controls: ALWAYS available with NO maximum limit! */}
      <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
        
        {/* Multi-File Upload Button with Drag & Drop */}
        <div className="sm:col-span-5">
          <label className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 border-2 border-dashed border-[#fdb927]/50 hover:border-[#fdb927] rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm">
            {isProcessingFile ? (
              <>
                <Loader2 className="w-4 h-4 text-[#fdb927] animate-spin" />
                <span className="text-[#fdb927]">
                  Uploading {uploadProgress?.current} of {uploadProgress?.total}...
                </span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#fdb927]" />
                <span>Upload Multiple Images</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessingFile}
            />
          </label>
        </div>

        <div className="hidden sm:block sm:col-span-1 text-center text-white/40 text-xs font-bold">
          OR
        </div>

        {/* Paste URL Input */}
        <div className="sm:col-span-6 flex gap-1.5">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste Image URL..."
            className="flex-1 px-3 py-2 bg-black/40 border border-[#fdb927]/30 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#fdb927]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="px-3.5 py-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-black text-xs rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add URL</span>
          </button>
        </div>

      </div>

      {isDragging && (
        <div className="text-center py-2 text-xs font-bold text-[#fdb927] animate-pulse">
          Drop your image files here to add them instantly!
        </div>
      )}
    </div>
  );
}
