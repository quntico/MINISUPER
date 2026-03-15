
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ImageUpload = ({ currentImage, onImageChange, onImageDelete, className }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato no válido. Usa JPG, PNG o WEBP.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 5MB.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    onImageChange(imageUrl, file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />

      {currentImage ? (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border group bg-muted/30">
          <img 
            src={currentImage} 
            alt="Vista previa" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Cambiar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              size="icon"
              onClick={onImageDelete}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div className="p-3 rounded-full bg-muted">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-medium">Haz clic o arrastra</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (Max 5MB)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
