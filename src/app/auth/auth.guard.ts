import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { Store } from "@ngrx/store";

import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard  
{
    constructor(
        private authService: AuthService, 
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
    | boolean 
    | UrlTree 
    | Promise<boolean | UrlTree> 
    | Observable<boolean | UrlTree>
    {
        return this.store.select('auth')
        .pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            map(user => {
                const isAuth = !!user;
                if ( isAuth)
                {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            }), 
            /*tap(isAuth => {
                if (!isAuth)
                {
                    this.router.navigate(['/auth']);
                }
            })*/
        );
    }
}