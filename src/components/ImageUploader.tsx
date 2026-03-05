import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (imageData: string) => void;
}

const ImageUploader = ({ onImageSelected }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelected(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-primary/20">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 rounded-full w-8 h-8"
            onClick={() => setPreview(null)}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full">
          <label className="flex flex-col items-center justify-center aspect-square bg-secondary/50 rounded-2xl border-2 border-dashed border-muted-foreground/20 cursor-pointer hover:bg-secondary transition-colors">
            <Camera className="mb-2 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Camera</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </label>
          <label className="flex flex-col items-center justify-center aspect-square bg-secondary/50 rounded-2xl border-2 border-dashed border-muted-foreground/20 cursor-pointer hover:bg-secondary transition-colors">
            <ImageIcon className="mb-2 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Gallery</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;