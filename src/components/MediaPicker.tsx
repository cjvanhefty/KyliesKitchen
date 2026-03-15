import { useRef } from 'react';
import { pickImageFromCapacitor } from '../utils/capture';
import './MediaPicker.css';

type Accept = 'image' | 'video' | 'image,video';

interface MediaPickerProps {
  accept?: Accept;
  capture?: boolean;
  onPick: (file: File) => void;
  label: string;
  className?: string;
}

export function MediaPicker({ accept = 'image', capture, onPick, label, className }: MediaPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPick(file);
      e.target.value = '';
    }
  };

  const handleClick = async () => {
    if (accept === 'image') {
      const file = await pickImageFromCapacitor();
      if (file) {
        onPick(file);
        return;
      }
    }
    inputRef.current?.click();
  };

  return (
    <div className={`media-picker ${className ?? ''}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*'}
        capture={capture}
        onChange={handleChange}
        className="media-picker-input"
        aria-label={label}
      />
      <button
        type="button"
        className="btn secondary"
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
}
