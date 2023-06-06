import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from './store/shopping-list.actions';

import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  //private igChanged: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() 
  {
    this.ingredients = this.store.select('shoppingList');
    /*this.ingredients = this.slService.getIngredients();
    this.igChanged = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );*/
  }

  onEditItem(index: number)
  {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
    //this.slService.startedEditing.next(index);
  }

  ngOnDestroy()
  {
   // this.igChanged.unsubscribe();  
  }

}
