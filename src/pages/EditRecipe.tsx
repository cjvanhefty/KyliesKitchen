import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import { updateRecipe } from '../db/schema';
import RecipeForm, { recipeToFormData, type RecipeFormData } from './RecipeForm';
import { RecipeMediaSection } from '../components/RecipeMediaSection';
import './RecipeForm.css';

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, loading, error } = useRecipe(id);

  const handleSubmit = async (data: RecipeFormData) => {
    if (!id) return;
    await updateRecipe(id, data);
    navigate(`/recipe/${id}`, { replace: true });
  };

  if (loading || !id) {
    return (
      <div className="recipe-form-page">
        <p className="loading">Loading…</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-form-page">
        <p className="error">{error ? error.message : 'Recipe not found.'}</p>
      </div>
    );
  }

  return (
    <div className="recipe-form-page">
      <h1>Edit recipe</h1>
      <RecipeForm
        initial={recipeToFormData(recipe)}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
      <RecipeMediaSection recipeId={id} />
    </div>
  );
}
