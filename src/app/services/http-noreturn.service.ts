import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '../providers/Storage';

@Injectable({
  providedIn: 'root'
})
export class HttpNoreturnService{

    constructor(
    ) { 
    }

    public getHeader() {
        if (Storage.localStorage.get('token')) {
            let obj : any, info : any = JSON.parse(Storage.localStorage.get('userInfo'))
            if (info) {
                obj = new HttpHeaders({
                    'accesstoken' : Storage.localStorage.get('token'),
                    'appType' : '5',
                    'userId' : Storage.localStorage.get('userId'),
                    'userType' : Storage.localStorage.get('userType') + '',
                    'deptId' : Storage.localStorage.get('deptId'),
                })
            }else {
                obj = new HttpHeaders({
                    'accesstoken' : Storage.localStorage.get('token')
                })
            }
            return obj
        }
    }

}
