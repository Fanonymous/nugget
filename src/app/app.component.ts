import { Component, HostListener } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { Router } from '@angular/router';
import { Storage } from './providers/Storage'
import { HttpServiceService } from './services/http-service.service'
import { Helper } from './providers/Helper'
import { NativeService } from './providers/NativeService'
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
    public exitapp : Boolean = false
    
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router : Router,
        private http : HttpServiceService,
        private navController : NavController,
        private helper : Helper,
        private androidPermissions : AndroidPermissions,
        private native : NativeService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.permissions()
            this.relogin()
        });
    }

    relogin() {
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
    }

    permissions() {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            result => console.log('Has permission?',result.hasPermission),
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
          );
    }

    @HostListener('document:ionBackButton', ['$event'])
    public overrideHardwareBackAction($event : any) {
        $event.detail.register(100, async () => {
            if (this.router.url == '/tabs/infomation' || this.router.url == '/tabs/teaching' || this.router.url == '/tabs/analysis' || this.router.url == '/tabs/mycenter') {
                if (!this.exitapp) {
                    this.helper.message('再按一次退出应用程序')
                    this.exitapp = true
                    let timer = setTimeout(() => {
                        this.exitapp = false
                        clearTimeout(timer)
                        timer = null
                    }, 2000)
                    return
                }
                this.exitapp = false
                this.native.appMinimize()
            }else {
                this.navController.back()
            }
        })
    }
}
