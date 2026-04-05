import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface RoomImageUploadProps {
  roomIndex: number;
  images: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export function RoomImageUpload({ roomIndex, images, onImagesChange, maxImages = 5 }: RoomImageUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useCallback(async (file: File) => {
    if (!user) return null;
    if (!file.type.startsWith("image/")) { toast({ title: "Invalid file", description: "Please upload JPG, PNG or WebP", variant: "destructive" }); return null; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "File too large", description: "Max 5MB", variant: "destructive" }); return null; }
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
    const { data, error } = await supabase.storage.from("room-images").upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return null; }
    const { data: urlData } = supabase.storage.from("room-images").getPublicUrl(data.path);
    return urlData.publicUrl;
  }, [user, toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of files.slice(0, remaining)) { const url = await uploadImage(file); if (url) newUrls.push(url); }
    if (newUrls.length > 0) { onImagesChange([...images, ...newUrls]); toast({ title: "Uploaded", description: `${newUrls.length} image(s) added` }); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = async (index: number) => {
    const url = images[index];
    const p = url.split("/room-images/")[1];
    if (p) await supabase.storage.from("room-images").remove([p]);
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Room Photos ({images.length}/{maxImages})</label>
      {images.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {images.map((url, index) => (
            <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
              <img src={url} alt={`Room photo ${index + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
              {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">Main</span>}
            </div>
          ))}
        </div>
      )}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors" onClick={() => fileInputRef.current?.click()}>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileSelect} className="hidden" />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 py-2"><Loader2 className="animate-spin text-accent" size={20} /><span className="text-sm text-muted-foreground">Uploading...</span></div>
          ) : (
            <div className="flex flex-col items-center gap-1 py-2"><ImagePlus className="text-muted-foreground" size={24} /><span className="text-sm text-muted-foreground">Click or drag photos here</span><span className="text-xs text-muted-foreground">JPG, PNG or WebP — Max 5MB</span></div>
          )}
        </div>
      )}
    </div>
  );
}
