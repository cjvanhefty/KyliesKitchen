import Dexie, { type EntityTable } from 'dexie';

export interface Recipe {
  id: string;
  title: string;
  source: string;
  ingredients: string;
  instructions: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type MediaType = 'photo' | 'video';
export type MediaRole = 'show' | 'memory' | 'handwritten';

export interface RecipeMedia {
  id: string;
  recipeId: string;
  type: MediaType;
  role: MediaRole;
  blob: Blob;
  order: number;
  createdAt: number;
}

export class KyliesKitchenDB extends Dexie {
  recipes!: EntityTable<Recipe, 'id'>;
  recipeMedia!: EntityTable<RecipeMedia, 'id'>;

  constructor() {
    super('KyliesKitchenDB');
    this.version(1).stores({
      recipes: 'id, title, createdAt, updatedAt',
      recipeMedia: 'id, recipeId, [recipeId+role], order, createdAt',
    });
  }
}

export const db = new KyliesKitchenDB();

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
  const now = Date.now();
  const record: Recipe = {
    ...recipe,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await db.recipes.add(record);
  return record;
}

export async function updateRecipe(id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>): Promise<void> {
  await db.recipes.update(id, { ...updates, updatedAt: Date.now() });
}

export async function getRecipe(id: string): Promise<Recipe | undefined> {
  return db.recipes.get(id);
}

export async function getAllRecipes(): Promise<Recipe[]> {
  return db.recipes.orderBy('updatedAt').reverse().toArray();
}

export async function deleteRecipe(id: string): Promise<void> {
  await db.transaction('rw', db.recipes, db.recipeMedia, async () => {
    await db.recipeMedia.where('recipeId').equals(id).delete();
    await db.recipes.delete(id);
  });
}

export async function addRecipeMedia(media: Omit<RecipeMedia, 'id' | 'createdAt'>): Promise<RecipeMedia> {
  const record: RecipeMedia = {
    ...media,
    id: generateId(),
    createdAt: Date.now(),
  };
  await db.recipeMedia.add(record);
  return record;
}

export async function getRecipeMedia(recipeId: string): Promise<RecipeMedia[]> {
  return db.recipeMedia.where('recipeId').equals(recipeId).sortBy('order');
}

export async function getHandwrittenMedia(recipeId: string): Promise<RecipeMedia | undefined> {
  return db.recipeMedia.where(['recipeId', 'role']).equals([recipeId, 'handwritten']).first();
}

export async function deleteRecipeMedia(id: string): Promise<void> {
  await db.recipeMedia.delete(id);
}

export async function setRecipeMediaOrder(_recipeId: string, mediaIds: string[]): Promise<void> {
  await db.transaction('rw', db.recipeMedia, async () => {
    for (let i = 0; i < mediaIds.length; i++) {
      await db.recipeMedia.update(mediaIds[i], { order: i });
    }
  });
}
