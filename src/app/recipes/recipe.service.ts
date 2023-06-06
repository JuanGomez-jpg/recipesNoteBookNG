import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { Store } from "@ngrx/store";

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'

import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService
{
    recipesChanged = new Subject<Recipe[]>();

    /*private recipes: Recipe[] = [
      new Recipe(
        'Test Recipe',
        'This is a test',
        'https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/images/2019/09/enchiladas-con-salsa-guajillo.jpg',
        [
            new Ingredient('Meat', 1),
            new Ingredient('Fries', 20)
        ]),
  
      new Recipe(
        'Test Another Recipe',
        'This is another test',
        'https://assets.unileversolutions.com/recipes-v2/218094.jpg?imwidth=1200',
        [
            new Ingredient('Buns', 2),
            new Ingredient('Meat', 2)
        ])
    ];*/
    private recipes: Recipe[] = [];

    constructor(
        private store: Store<fromApp.AppState>
    ) {}

    setRecipes(recipes: Recipe[])
    {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes()
    {
        return this.recipes.slice();
    }

    getRecipe(index: number)
    {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[])
    {
        //this.slService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe)
    {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe)
    {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number)
    {   
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}