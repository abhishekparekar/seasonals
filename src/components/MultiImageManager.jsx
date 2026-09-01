import React, { useState } from 'react';
import { Upload, Plus, Trash2, Image as ImageIcon, Link2, Sparkles, Check } from 'lucide-react';

export default function MultiImageManager({
  images = [],
  onChange,
  label = "Background Images (Slider / Carousel)",
  helperText = "Upload multiple images or paste image URLs. When multiple images are added, they will smoothly crossfade automatically on the page.",
  maxImages = 8
}) {
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessingFile(true);
    let loadedCount = 0;
    const newBase64s = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newBase64s.push(event.target.result);
        }
        loadedCount++;
        if (loadedCount === files.length) {
          onChange([...imageList, ...newBase64s].slice(0, maxImages));
          setIsProcessingFile(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (indexToRemove) => {
    const updated = imageList.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="bg-black/30 border border-[#fdb927]/30 rounded-2xl p-4 sm:p-5 space-y-3.5 font-inter">
      <div className="flex items-center justify-between">
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
        <span className="text-[10px] font-bold text-[#fdb927] bg-[#fdb927]/15 px-2 py-0.5 rounded-full border border-[#fdb927]/30">
          {imageList.length} / {maxImages} Images
        </span>
      </div>

      {/* Existing Images Thumbnail Grid */}
      {imageList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
          {imageList.map((imgSrc, idx) => (
            <div
              key={idx}
              className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border-2 border-[#fdb927]/40 bg-black/50 group shadow-md"
            >
              <img
                src={imgSrc}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              
              <div className="absolute top-1 left-1 bg-black/80 text-[#fdb927] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                #{idx + 1}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-1 sm:p-1.5 bg-red-600/95 hover:bg-red-600 text-white rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow z-10"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add More Controls: Upload local file or paste URL */}
      {imageList.length < maxImages && (
        <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
          
          {/* File Upload Button */}
          <div className="sm:col-span-5">
            <label className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 border border-[#fdb927]/40 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm">
              <Upload className="w-3.5 h-3.5 text-[#fdb927]" />
              <span>{isProcessingFile ? 'Uploading...' : 'Upload Image File(s)'}</span>
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
              className="px-3 py-2 bg-[#fdb927] hover:bg-[#ffc84a] text-[#1b072a] font-black text-xs rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
