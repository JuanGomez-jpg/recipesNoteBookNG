import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap } from "rxjs";
import { throwError } from "rxjs";

import { User } from "./user.model";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    signUp(email: string, password: string)
    {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToke: true
            }
        ).pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    login(email: string, password: string)
    {
        return this.http.post<any>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToke: true
            }
        ).pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, 3600)
        }));
    }

    autoLogin()
    {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData)
        {
            return;
        }

        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token)
        {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogOut(expirationDuration);
        }
    }

    autoLogOut(expriationDuration: number)
    {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOut();
        }, expriationDuration);
    }

    logOut()
    {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (!this.tokenExpirationTimer)
        {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number)
    {
        const expriationDate = new Date(new Date().getTime() + 3600 * 1000);
        const user = new User(
            email,
            userId,
            token,
            expriationDate
        );
        this.autoLogOut(3600 * 1000);
        localStorage.removeItem('userData');
        localStorage.setItem('userData', JSON.stringify(user));
        this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse)
    {
        let errorMessage = "An unknown error ocurred";
        if (!errorRes.error || !errorRes.error.error)
        {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message)
        {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already has been taken'
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = "This email does not exist"
                break;
            case 'INVALID_PASSWORD':    
                errorMessage = "This password is not correct";
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'Your account has been disabled due too many failed attempts';
                break;
            default:
                errorMessage = errorRes.error.error.message;
                break;
        }
        return throwError(errorMessage);
    }
}