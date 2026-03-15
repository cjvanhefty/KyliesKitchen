import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { seedRecipes } from '../data/seedRecipes';
import { exportAll, downloadExport } from '../utils/exportData';
import type { Recipe } from '../db/schema';
import './RecipeList.css';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card">
      <h3>{recipe.title}</h3>
      {recipe.source && <p className="source">From: {recipe.source}</p>}
    </Link>
  );
}

export default function RecipeList() {
  const { recipes, loading, error, refresh } = useRecipes();
  const [seeding, setSeeding] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleLoadSample = async () => {
    setSeeding(true);
    try {
      await seedRecipes();
      await refresh();
    } finally {
      setSeeding(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const payload = await exportAll();
      const name = `kylies-kitchen-${new Date().toISOString().slice(0, 10)}.json`;
      downloadExport(payload, name);
    } finally {
      setExporting(false);
    }
  };

  if (error) {
    return (
      <div className="recipe-list">
        <p className="error">Failed to load recipes: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="recipe-list">
        <p className="loading">Loading recipes…</p>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <header className="list-header">
        <h1>Kylie&apos;s Kitchen</h1>
        <div className="header-actions">
          <Link to="/recipe/new/from-photo" className="btn secondary">
            Create from photo
          </Link>
          <Link to="/recipe/new" className="btn primary">
            Add recipe
          </Link>
          <button
            type="button"
            className="btn secondary"
            onClick={handleExport}
            disabled={exporting || recipes.length === 0}
          >
            {exporting ? 'Exporting…' : 'Export backup'}
          </button>
        </div>
      </header>
      {recipes.length === 0 ? (
        <div className="empty-state">
          <p className="empty">No recipes yet. Add your first recipe or load sample recipes.</p>
          <button
            type="button"
            className="btn primary"
            onClick={handleLoadSample}
            disabled={seeding}
          >
            {seeding ? 'Loading…' : 'Load sample recipes (5 recipes)'}
          </button>
        </div>
      ) : (
        <ul className="recipe-grid">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
