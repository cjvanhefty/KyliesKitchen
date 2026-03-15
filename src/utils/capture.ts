import { Capacitor } from '@capacitor/core';

/**
 * Check if the app is running inside Capacitor (native iOS/Android).
 */
export function isCapacitor(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform?.() === true;
}

/**
 * Get a photo from the camera or gallery when on Capacitor; returns a File-like blob.
 * On web, returns null so the caller can fall back to file input.
 */
export async function pickImageFromCapacitor(): Promise<File | null> {
  if (!isCapacitor()) return null;
  try {
    const { Camera, CameraResultType } = await import('@capacitor/camera');
    const result = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: undefined, // prompt: camera or gallery
      resultType: CameraResultType.DataUrl,
    });
    if (!result.dataUrl) return null;
    const res = await fetch(result.dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
    return file;
  } catch {
    return null;
  }
}
