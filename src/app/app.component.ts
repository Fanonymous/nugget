import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { NativeService } from './providers/NativeService'
import { Storage } from './providers/Storage'
import { HttpServiceService } from './services/http-service.service'
import { Helper } from './providers/Helper'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router : Router,
        private native : NativeService,
        private http : HttpServiceService,
        private navController : NavController,
        private helper : Helper
    ) {
        this.initializeApp();

        this.platform.backButton.subscribe(() => {
            if (this.router.url === '/home/tabs/infomation' || this.router.url == '/home/tabs/teaching' || this.router.url == '/home/tabs/analysis' || this.router.url == '/home/tabs/mycenter' || (this.router.url === '/login' && !Storage.localStorage.get('token'))) {
                this.native.appMinimize();
            }
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            if (Storage.localStorage.get('token')) { 
                this.http.get(`uc/user/userInfo?userId=${JSON.parse(Storage.localStorage.get('userInfo')).userId}`).subscribe(data => {
                    if (data.code == 0) {
                        let _obj : any = data.user
                        let _userType : any = _obj.userType, _userId : any = _obj.userId, userInfoArr : any = _obj.userInfo, _deptId : any
                        for (let item of userInfoArr) {
                            if (item.userType == _userType) {
                                _deptId = item.deptIds
                                break
                            }
                        }
                        Storage.localStorage.set('userInfo', JSON.stringify(data.user))
                        Storage.localStorage.set('deptId', _deptId)
                        Storage.localStorage.set('userType', _userType)
                        Storage.localStorage.set('userId', _userId)

                        this.http.get('WechatAppletAnalysis/getProductByRole').subscribe(res => {
                            if (res.code == 0) {
                                Storage.localStorage.set('menuList', JSON.stringify(res.list))
                            }
                        })
                    }else {
                        this.helper.alert('提示', '登录失效，请重新登录')
                        Storage.localStorage.remove('token')
                        Storage.localStorage.remove('userInfo')
                        Storage.localStorage.remove('menuList')
                        Storage.localStorage.remove('deptId')
                        Storage.localStorage.remove('userType')
                        Storage.localStorage.remove('userId')
                        this.navController.navigateForward(['login'])
                    }
                })
            }
        });
    }
}
