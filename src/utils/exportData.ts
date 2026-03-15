import * as db from '../db/schema';

export interface ExportRecipe {
  id: string;
  title: string;
  source: string;
  ingredients: string;
  instructions: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExportMedia {
  id: string;
  recipeId: string;
  type: 'photo' | 'video';
  role: string;
  order: number;
  createdAt: number;
  dataUrl: string;
}

export interface ExportPayload {
  version: 1;
  exportedAt: string;
  recipes: ExportRecipe[];
  media: ExportMedia[];
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function exportAll(): Promise<ExportPayload> {
  const recipes = await db.getAllRecipes();
  const payload: ExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    recipes: recipes.map((r) => ({
      id: r.id,
      title: r.title,
      source: r.source,
      ingredients: r.ingredients,
      instructions: r.instructions,
      notes: r.notes,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
    media: [],
  };

  for (const recipe of recipes) {
    const mediaList = await db.getRecipeMedia(recipe.id);
    for (const m of mediaList) {
      const dataUrl = await blobToDataUrl(m.blob);
      payload.media.push({
        id: m.id,
        recipeId: m.recipeId,
        type: m.type,
        role: m.role,
        order: m.order,
        createdAt: m.createdAt,
        dataUrl,
      });
    }
  }

  return payload;
}

export function downloadExport(payload: ExportPayload, filename = 'kylies-kitchen-backup.json'): void {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
