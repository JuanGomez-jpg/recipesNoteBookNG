import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingLoaderComponent } from './shared/loading-loader/loading-loader.component';
import { AlertComponent } from './shared/alert/alert.component';

import { DropdownDirective } from './shared/dropdown.directive';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { RecipesModule } from './recipes/recipes.module';

import { PlaceHolderDirective } from './shared/placeholder/placeholder.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    AuthComponent,
    LoadingLoaderComponent,
    AlertComponent,
    PlaceHolderDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    RecipesModule
  ],
  providers: [
    ShoppingListService, 
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
