import { useState, useCallback } from 'react';
import type { Recipe } from '../db/schema';

export interface RecipeFormData {
  title: string;
  source: string;
  ingredients: string;
  instructions: string;
  notes: string;
}

const emptyForm: RecipeFormData = {
  title: '',
  source: '',
  ingredients: '',
  instructions: '',
  notes: '',
};

export function recipeToFormData(recipe: Recipe): RecipeFormData {
  return {
    title: recipe.title,
    source: recipe.source,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    notes: recipe.notes,
  };
}

interface RecipeFormProps {
  initial?: RecipeFormData;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  submitLabel: string;
}

export default function RecipeForm({ initial = emptyForm, onSubmit, submitLabel }: RecipeFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [source, setSource] = useState(initial.source);
  const [ingredients, setIngredients] = useState(initial.ingredients);
  const [instructions, setInstructions] = useState(initial.instructions);
  const [notes, setNotes] = useState(initial.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSaving(true);
      try {
        await onSubmit({
          title: title.trim(),
          source: source.trim(),
          ingredients: ingredients.trim(),
          instructions: instructions.trim(),
          notes: notes.trim(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setSaving(false);
      }
    },
    [title, source, ingredients, instructions, notes, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Recipe name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="source">Source (e.g. cookbook or person)</label>
        <input
          id="source"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="From the kitchen of..."
        />
      </div>
      <div className="form-group">
        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={6}
          placeholder="One per line or block of text"
        />
      </div>
      <div className="form-group">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={10}
          placeholder="Steps..."
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Optional notes, tips, substitutions"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
