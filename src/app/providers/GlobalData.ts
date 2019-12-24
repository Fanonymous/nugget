import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalData {
    static userId: string; // 用户id
    static username: string; // 用户名
    static mobileNumber: string; // 手机号码
    static realname: string; // 真实姓名
    static token: string; // token
    static menuIds : String  //菜单列表

}
