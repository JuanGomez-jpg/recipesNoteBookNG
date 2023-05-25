import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AlertComponent } from "../shared/alert/alert.component";
import { LoadingLoaderComponent } from "../shared/loading-loader/loading-loader.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { DropdownDirective } from "../shared/dropdown.directive";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingLoaderComponent,
        PlaceHolderDirective,
        DropdownDirective,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        AlertComponent,
        LoadingLoaderComponent,
        PlaceHolderDirective,
        DropdownDirective,
        CommonModule,
    ],
})
export class SharedModule
{

}