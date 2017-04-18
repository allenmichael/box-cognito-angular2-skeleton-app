import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { CognitoUtil, UserLoginService } from "../aws/cognito.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthService {

    authenticated: boolean = false;

    constructor(public router: Router, private cognito: CognitoUtil, private userServices: UserLoginService) {
    }

    public isAuthenticated(): Promise<boolean> {
        // Check whether the current time is past the 
        // access token's expiry time
        return this.retrieveIdToken()
            .then(token => {
                const jwtHelper = new JwtHelper();
                this.authenticated = token !== null && !jwtHelper.isTokenExpired(token);
                return this.authenticated;
            })
            .catch(() => {
                this.authenticated = false;
                return this.authenticated;
            });
    }

    public retrieveIdToken() {
        return this.cognito.getIdToken();
    }

    public retrieveAccessToken() {
        return this.cognito.getAccessToken();
    }

    public logout() {
        this.userServices.logout();
    }

}
