import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe, addRecipeMedia } from '../db/schema';
import { extractRecipeFromImage, type ExtractedRecipe } from '../utils/visionApi';
import { pickImageFromCapacitor } from '../utils/capture';
import RecipeForm, { type RecipeFormData } from './RecipeForm';
import { MediaPicker } from '../components/MediaPicker';
import './RecipeForm.css';
import './CreateFromPhoto.css';

export default function CreateFromPhoto() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'pick' | 'loading' | 'form' | 'error'>('pick');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [extracted, setExtracted] = useState<ExtractedRecipe | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilePick = async (file: File) => {
    setPendingFile(file);
    setStep('loading');
    setErrorMessage(null);
    try {
      const result = await extractRecipeFromImage(file);
      setExtracted(result);
      setStep('form');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to extract recipe');
      setStep('error');
      setExtracted(null);
    }
  };

  const handleCapacitorPick = async () => {
    const file = await pickImageFromCapacitor();
    if (file) {
      handleFilePick(file);
      return;
    }
    // Fallback: user can use the MediaPicker below (file input)
    setStep('pick');
  };

  const handleSubmit = async (data: RecipeFormData) => {
    const recipe = await createRecipe(data);
    if (pendingFile) {
      const type = pendingFile.type.startsWith('video/') ? 'video' : 'photo';
      await addRecipeMedia({
        recipeId: recipe.id,
        type,
        role: 'handwritten',
        blob: pendingFile,
        order: 0,
      });
    }
    navigate(`/recipe/${recipe.id}`, { replace: true });
  };

  const initialFormData: RecipeFormData | undefined = extracted
    ? {
        title: extracted.title,
        source: extracted.source,
        ingredients: extracted.ingredients,
        instructions: extracted.instructions,
        notes: extracted.notes,
      }
    : undefined;

  if (step === 'pick') {
    return (
      <div className="create-from-photo">
        <h1>Create recipe from photo</h1>
        <p className="hint">Take or upload a photo of a handwritten or printed recipe. We&apos;ll extract the text and pre-fill the form.</p>
        <div className="pick-actions">
          <button type="button" className="btn primary" onClick={handleCapacitorPick}>
            Take or choose photo
          </button>
          <MediaPicker accept="image" label="Or pick from device" onPick={handleFilePick} />
        </div>
        <p className="back-hint">
          <a href="/">Cancel</a> and add a recipe manually instead.
        </p>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="create-from-photo">
        <h1>Reading recipe…</h1>
        <p className="loading">Extracting text from the image. This may take a few seconds.</p>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="create-from-photo">
        <h1>Couldn&apos;t read recipe</h1>
        <p className="form-error">{errorMessage}</p>
        <p>You can still add the recipe manually and attach this photo as the original recipe.</p>
        <div className="pick-actions">
          <MediaPicker accept="image" label="Try another photo" onPick={handleFilePick} />
        </div>
        {pendingFile && (
          <div className="form-with-photo">
            <p>Or continue with the photo you selected:</p>
            <RecipeForm
              initial={undefined}
              onSubmit={handleSubmit}
              submitLabel="Add recipe (and attach photo as original)"
            />
          </div>
        )}
        <p className="back-hint">
          <a href="/">Cancel</a>
        </p>
      </div>
    );
  }

  return (
    <div className="create-from-photo">
      <h1>Create recipe from photo</h1>
      <p className="hint">Review and edit the extracted recipe, then save. The photo will be attached as the original recipe.</p>
      <RecipeForm
        initial={initialFormData}
        onSubmit={handleSubmit}
        submitLabel="Add recipe"
      />
    </div>
  );
}
