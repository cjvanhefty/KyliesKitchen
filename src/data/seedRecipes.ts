import type { Recipe } from '../db/schema';
import { createRecipe } from '../db/schema';

/** Recipe records for seeding (no id, createdAt, updatedAt – added by createRecipe). */
const seedData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Waffles (light & crispy)',
    source: 'Mom',
    ingredients: `3/4 C flour
1/4 C Cornstarch
1/2 t Salt
1/2 t baking powder
1/4 t baking soda
3/4 C buttermilk
1/4 C milk
6 T veg. oil
1 egg, separated
1 T Sugar
1/2 t vanilla`,
    instructions: `Mix flour, cornstarch, salt, baking powder, and soda.
In a separate bowl mix buttermilk, milk, and veg. oil; mix in egg yolk.
Beat egg white in a small bowl to almost soft peaks.
Sprinkle sugar into egg whites and continue to beat until whites are glossy. Beat in vanilla.
Pour wet ingredients into dry ingredients and whisk until just mixed. Add egg white to batter in dollops. Fold in with a spatula until just incorporated.
Add to waffle iron.`,
    notes: `If you don't have buttermilk, put 1 T vinegar in 1 C milk, let sit for 5 min, then add to mix.`,
  },
  {
    title: 'Cinnamon Sugar Mix',
    source: '',
    ingredients: `1/4 C Sugar
1 T Cinnamon`,
    instructions: 'Mix together. Use for toast, snickerdoodles, or topping.',
    notes: '',
  },
  {
    title: 'Taco Seasoning',
    source: '',
    ingredients: `1 T Chili powder
1 T Ground Cumin
1 T Garlic Powder
1 T Onion Powder
1/2 t Crushed Red Pepper`,
    instructions: 'Mix and use in place of a packet of taco seasoning (e.g. for 1 lb ground beef).',
    notes: '',
  },
  {
    title: 'Tater Tot Casserole',
    source: 'Great Grandma Mullenberg',
    ingredients: `1 lb. hamburger
1/2 onion
1/2 bag tater tots
1 can cream of chicken soup
1/2 can milk
Salt & pepper`,
    instructions: `Brown hamburger and onion, season with salt and pepper.
Lay hamburger in a casserole dish.
Mix cream of chicken soup and milk; pour over hamburger.
Spread tater tots on top and season.
Bake at 350° for about 45 min or until tots are crispy.
Mix all together before serving.`,
    notes: '',
  },
  {
    title: 'Biscuits & Gravy',
    source: '',
    ingredients: `1 lb. Jimmy Dean Pork Sausage
1 small container of heavy whipping cream
2-3 T flour`,
    instructions: `Brown sausage and bake biscuits (homemade or 1 pkg Pillsbury buttermilk Grands if short on time).
Mix cream and flour (start with 2 T; if too thin add 1 more, but 2 usually works).
In a saucepan heat cream mixture on medium; when thick add sausage.
Serve on top of biscuits.`,
    notes: 'Best if you make homemade biscuits but if you don\'t have time use 1 pkg of Pillsbury buttermilk Grands.',
  },
];

export async function seedRecipes(): Promise<void> {
  for (const recipe of seedData) {
    await createRecipe(recipe);
  }
}

export { seedData };
