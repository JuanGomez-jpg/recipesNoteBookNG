import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy
{
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;

    private closeSub: Subscription;

    constructor(
        private authService: AuthService, 
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    ngOnDestroy()
    {
        if (this.closeSub)
            this.closeSub.unsubscribe();
    }

    onSwitchMode()
    {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm)
    {
        if (!form.valid) 
        {
            return;
        }

        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<any>;

        this.isLoading = true;

        if (this.isLoginMode)
        {
            authObs = this.authService.login(email, password);
        }
        else
        {
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(
            resData => {
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
                this.showErrorAlert(errorMessage);
            }
        );

        form.reset();
    }

    onHandleError()
    {
        this.error = null;
    }

    private showErrorAlert(message: string)
    {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
            AlertComponent
        );
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef =  hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}