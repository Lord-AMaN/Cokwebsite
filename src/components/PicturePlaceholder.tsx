import { ImageOff } from 'lucide-react';

export default function PicturePlaceholder({ label, src }: { label: string; src?: string }) {
  if (src) {
    return (
      <div className="rounded-lg overflow-hidden border border-white/10">
        <img src={src} alt={label} className="w-full h-full block" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-black/30 p-6 flex flex-col items-center justify-center gap-2 text-center">
      <ImageOff className="w-6 h-6 text-blue-400/60" />
      <p className="text-xs text-gray-500">
        Add screenshot: <span className="text-gray-400">{label}</span>
      </p>
    </div>
  );
}