import { Link, useParams } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import { useRecipeMedia } from '../hooks/useRecipeMedia';
import { getHandwrittenMedia } from '../db/schema';
import { useEffect, useMemo, useState } from 'react';
import type { RecipeMedia } from '../db/schema';
import { MediaThumbnail } from '../components/MediaDisplay';
import './RecipeDetail.css';

function useHandwrittenMedia(recipeId: string | undefined) {
  const [media, setMedia] = useState<RecipeMedia | null>(null);
  useEffect(() => {
    if (!recipeId) {
      setMedia(null);
      return;
    }
    getHandwrittenMedia(recipeId).then((m) => setMedia(m ?? null));
  }, [recipeId]);
  return media;
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { recipe, loading, error } = useRecipe(id);
  const handwrittenMedia = useHandwrittenMedia(id);
  const { media: allMedia } = useRecipeMedia(id);
  const showMemoryMedia = allMedia.filter((m) => m.role === 'show' || m.role === 'memory');

  const handwrittenUrl = useMemo(
    () => (handwrittenMedia?.blob ? URL.createObjectURL(handwrittenMedia.blob) : null),
    [handwrittenMedia?.blob]
  );

  useEffect(() => {
    return () => {
      if (handwrittenUrl) URL.revokeObjectURL(handwrittenUrl);
    };
  }, [handwrittenUrl]);

  if (loading || !id) {
    return (
      <div className="recipe-detail">
        <p className="loading">Loading…</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail">
        <p className="error">{error ? error.message : 'Recipe not found.'}</p>
        <Link to="/">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <nav className="detail-nav">
        <Link to="/">← Back</Link>
        <Link to={`/recipe/${recipe.id}/edit`} className="btn secondary">
          Edit
        </Link>
      </nav>
      <article>
        <h1>{recipe.title}</h1>
        {recipe.source && <p className="source">From the kitchen of: {recipe.source}</p>}
        {handwrittenUrl && (
          <section className="original-recipe">
            <h2>Original recipe</h2>
            <img src={handwrittenUrl} alt="Original handwritten recipe" className="handwritten-img" />
          </section>
        )}
        {recipe.ingredients && (
          <section>
            <h2>Ingredients</h2>
            <pre className="ingredients">{recipe.ingredients}</pre>
          </section>
        )}
        {recipe.instructions && (
          <section>
            <h2>Instructions</h2>
            <pre className="instructions">{recipe.instructions}</pre>
          </section>
        )}
        {recipe.notes && (
          <section>
            <h2>Notes</h2>
            <p className="notes">{recipe.notes}</p>
          </section>
        )}
        {showMemoryMedia.length > 0 && (
          <section className="photos-videos">
            <h2>Photos & videos</h2>
            <div className="media-gallery">
              {showMemoryMedia.map((m) => (
                <MediaThumbnail key={m.id} media={m} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
