import { useEffect, useMemo, useState } from 'react';
import type { RecipeMedia } from '../db/schema';
import './MediaDisplay.css';

interface MediaDisplayProps {
  media: RecipeMedia;
  onRemove?: (id: string) => void;
  showRemove?: boolean;
}

function useObjectUrl(blob: Blob | undefined) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}

export function MediaThumbnail({ media, onRemove, showRemove }: MediaDisplayProps) {
  const url = useObjectUrl(media.type === 'photo' ? media.blob : undefined);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  useEffect(() => {
    if (media.type === 'video') {
      const u = URL.createObjectURL(media.blob);
      setVideoUrl(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [media.type, media.blob]);

  if (media.type === 'photo' && url) {
    return (
      <div className="media-thumbnail">
        <img src={url} alt="" />
        {showRemove && onRemove && (
          <button
            type="button"
            className="media-remove"
            onClick={() => onRemove(media.id)}
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  if (media.type === 'video' && videoUrl) {
    return (
      <div className="media-thumbnail media-video">
        <video src={videoUrl} controls />
        {showRemove && onRemove && (
          <button
            type="button"
            className="media-remove"
            onClick={() => onRemove(media.id)}
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return null;
}
