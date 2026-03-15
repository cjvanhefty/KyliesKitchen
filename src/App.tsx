import { Routes, Route } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import CreateFromPhoto from './pages/CreateFromPhoto';
import './App.css';

function App() {
  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/recipe/new" element={<AddRecipe />} />
        <Route path="/recipe/new/from-photo" element={<CreateFromPhoto />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/recipe/:id/edit" element={<EditRecipe />} />
      </Routes>
    </div>
  );
}

export default App;
