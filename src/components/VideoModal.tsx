import { X } from 'lucide-react';
import { getYouTubeId } from '../lib/youtube';

// Assumes `url` has already been validated as a YouTube link by the caller
// (see getYouTubeId usage in Castles.tsx / BotFarms.tsx click handlers).
// If somehow called with a bad link anyway, it renders nothing rather than
// showing a stuck blank overlay.
export default function VideoModal({
  url,
  title,
  onClose,
  accent = 'green',
}: {
  url: string;
  title: string;
  onClose: () => void;
  accent?: 'green' | 'blue';
}) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const borderColor = accent === 'green' ? 'border-green-500/30' : 'border-blue-500/30';
  const textColor = accent === 'green' ? 'text-green-300' : 'text-blue-300';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl rounded-2xl overflow-hidden border ${borderColor} bg-black/70 shadow-lg`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <p className={`text-sm font-semibold ${textColor} truncate pr-4`}>{title}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}