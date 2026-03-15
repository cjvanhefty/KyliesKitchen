import { useCallback, useEffect, useState } from 'react';
import type { RecipeMedia } from '../db/schema';
import * as db from '../db/schema';

export function useRecipeMedia(recipeId: string | undefined) {
  const [media, setMedia] = useState<RecipeMedia[]>([]);
  const [loading, setLoading] = useState(!!recipeId);

  const refresh = useCallback(async () => {
    if (!recipeId) {
      setMedia([]);
      return;
    }
    setLoading(true);
    try {
      const list = await db.getRecipeMedia(recipeId);
      setMedia(list);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { media, loading, refresh };
}
