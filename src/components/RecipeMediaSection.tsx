import { addRecipeMedia, deleteRecipeMedia, getHandwrittenMedia, getRecipeMedia } from '../db/schema';
import type { MediaRole, MediaType } from '../db/schema';
import { useCallback, useEffect, useState } from 'react';
import type { RecipeMedia } from '../db/schema';
import { MediaPicker } from './MediaPicker';
import { MediaThumbnail } from './MediaDisplay';
import './RecipeMediaSection.css';

interface RecipeMediaSectionProps {
  recipeId: string;
  onRefresh?: () => void;
}

function getMediaType(file: File): MediaType {
  return file.type.startsWith('video/') ? 'video' : 'photo';
}

export function RecipeMediaSection({ recipeId, onRefresh }: RecipeMediaSectionProps) {
  const [handwritten, setHandwritten] = useState<RecipeMedia | null>(null);
  const [showMemory, setShowMemory] = useState<RecipeMedia[]>([]);

  const loadHandwritten = useCallback(async () => {
    const m = await getHandwrittenMedia(recipeId);
    setHandwritten(m ?? null);
  }, [recipeId]);

  const loadShowMemory = useCallback(async () => {
    const all = await getRecipeMedia(recipeId);
    setShowMemory(all.filter((m) => m.role === 'show' || m.role === 'memory'));
  }, [recipeId]);

  useEffect(() => {
    loadHandwritten();
  }, [loadHandwritten]);
  useEffect(() => {
    loadShowMemory();
  }, [loadShowMemory]);

  const refresh = useCallback(() => {
    loadHandwritten();
    loadShowMemory();
    onRefresh?.();
  }, [loadHandwritten, loadShowMemory, onRefresh]);

  const handleAddHandwritten = async (file: File) => {
    if (handwritten) await deleteRecipeMedia(handwritten.id);
    await addRecipeMedia({
      recipeId,
      type: getMediaType(file),
      role: 'handwritten',
      blob: file,
      order: 0,
    });
    refresh();
  };

  const handleAddShowMemory = async (file: File, role: MediaRole) => {
    await addRecipeMedia({
      recipeId,
      type: getMediaType(file),
      role,
      blob: file,
      order: showMemory.length,
    });
    refresh();
  };

  const handleRemoveMedia = async (id: string) => {
    await deleteRecipeMedia(id);
    refresh();
  };

  return (
    <div className="recipe-media-section">
      <section className="media-block">
        <h3>Photo of original recipe</h3>
        <p className="media-hint">Add a photo of the handwritten or printed recipe (index card, cookbook page).</p>
        {handwritten ? (
          <div className="handwritten-slot">
            <MediaThumbnail media={handwritten} onRemove={handleRemoveMedia} showRemove />
            <MediaPicker
              label="Replace photo"
              accept="image"
              onPick={handleAddHandwritten}
            />
          </div>
        ) : (
          <MediaPicker label="Add photo of original recipe" accept="image" onPick={handleAddHandwritten} />
        )}
      </section>
      <section className="media-block">
        <h3>Photos & videos (show or memories)</h3>
        <p className="media-hint">Add photos or videos to display with the recipe or as memories.</p>
        <div className="show-memory-pickers">
          <MediaPicker
            label="Add photo"
            accept="image"
            onPick={(f) => handleAddShowMemory(f, 'show')}
          />
          <MediaPicker
            label="Add video"
            accept="video"
            onPick={(f) => handleAddShowMemory(f, 'memory')}
          />
        </div>
        {showMemory.length > 0 && (
          <div className="show-memory-grid">
            {showMemory.map((m) => (
              <MediaThumbnail
                key={m.id}
                media={m}
                onRemove={handleRemoveMedia}
                showRemove
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
