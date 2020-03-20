import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { NavController } from '@ionic/angular';

import { Storage } from '../providers/Storage'

import { HttpServiceService } from '../services/http-service.service'
import { Helper } from '../providers/Helper'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    username = ''
    password = ''

    constructor(
        public helper : Helper, 
        public http : HttpServiceService, 
        public navController : NavController) { }

    ngOnInit() {
    }

    getMenuList() {
        this.http.get('WechatAppletAnalysis/getProductByRole').subscribe(res => {
            if (res.code == 0) {
                Storage.localStorage.set('menuList', JSON.stringify(res.list))
                this.navController.navigateForward(['home'])
            }
        })
    }

    handleLogin() {
        if (!this.username && !this.password) {
            this.helper.message('请填写用户名和密码')
        }else {
            this.http.post('sys/login', {
                appType : 5,
                username : this.username,
                password : CryptoJS.SHA256(this.password).toString(CryptoJS.enc.Hex),
                platformName : 'app',
                registrationId: Storage.localStorage.get('registrationId')
            }).subscribe(res => {
                if (res.code == 0) {
                    Storage.localStorage.set('token', res.token)
                    this.http.get(`uc/user/userInfo?userId=${res.userInfo.userId}`).subscribe(data => {
                        if (data.code == 0) {
                            let _obj: any = data.user
                            let _userType: any = _obj.userType, 
                                _userId: any = _obj.userId, 
                                userInfoArr : any = _obj.userInfo, 
                                _deptId : any, _deptType: any, 
                                _deptName: any
                            for (let item of userInfoArr) {
                                if (item.userType == _userType) {
                                    _deptId = item.deptIds
                                    _deptType = item.deptTypes
                                    _deptName = item.deptName
                                    break
                                }
                            }
                            Storage.localStorage.set('userInfo', JSON.stringify(data.user))
                            Storage.localStorage.set('deptId', _deptId)
                            Storage.localStorage.set('deptType', _deptType)
                            Storage.localStorage.set('deptName', _deptName)
                            Storage.localStorage.set('userType', _userType)
                            Storage.localStorage.set('userId', _userId)
                            Storage.localStorage.set('userName', _obj.username)
                            this.getMenuList()
                        }else {
                            this.helper.message(data.msg)
                        }
                    })
                }else {
                    this.helper.message(res.msg)
                }
            })
        }
    }

    forgetPass() {
        this.helper.message('请联系管理员')
    }

}
