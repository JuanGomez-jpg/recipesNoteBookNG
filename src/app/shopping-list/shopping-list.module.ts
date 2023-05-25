import { NgModule } from "@angular/core";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";

import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../auth/shared.module";

@NgModule({
    declarations:[
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports: [
        FormsModule,
        RouterModule.forChild([
            { path: 'shopping-list', component: ShoppingListComponent },
        ]),
        SharedModule,
    ],
    exports: [

    ]
})
export class ShoppingListModule
{
    
}