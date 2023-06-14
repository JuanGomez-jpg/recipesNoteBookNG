import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { switchMap, map } from "rxjs/operators";

import * as RecipesActions from './recipe.actions';

import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeEffects 
{
    fetchRecipes = createEffect(() => 
        this.acionts$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http
                .get<Recipe[]>(
                  'https://ng-recipes-book-39481-default-rtdb.firebaseio.com/recipes.json'
                )
            }),
            map(recipes => {
                return recipes.map(recipe => {
                  return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                  };
                });
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        ))

    constructor(
        private acionts$: Actions,
        private http: HttpClient
    ) {}
}