import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      <p className="text-sm text-gray-500 font-display tracking-wide">{label}</p>
    </div>
  );
}
