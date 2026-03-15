import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../db/schema';
import RecipeForm, { type RecipeFormData } from './RecipeForm';
import './RecipeForm.css';

export default function AddRecipe() {
  const navigate = useNavigate();

  const handleSubmit = async (data: RecipeFormData) => {
    const recipe = await createRecipe(data);
    navigate(`/recipe/${recipe.id}`, { replace: true });
  };

  return (
    <div className="recipe-form-page">
      <h1>Add recipe</h1>
      <RecipeForm onSubmit={handleSubmit} submitLabel="Add recipe" />
    </div>
  );
}
