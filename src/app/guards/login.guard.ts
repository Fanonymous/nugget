import { Injectable } from '@angular/core';

import { Storage } from '../providers/Storage'
import { CanActivate } from "@angular/router";
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate{
    constructor(public navController : NavController) {}

    canActivate(){
        let token= Storage.localStorage.get('token');
        if(!token){
            this.navController.navigateForward('login')
            return false;
        }else{
            return true;
        }
    }
}
