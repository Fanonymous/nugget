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
import { JPushService } from './providers/jPushService'

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
        private native : NativeService,
        private jPushService: JPushService
    ) {
        this.initializeApp()
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.jPushService.initJpush()
            this.permissions()
            this.relogin()
        });
    }

    relogin() {
        if (Storage.localStorage.get('token')) { 
            this.http.get(`uc/user/userInfo?userId=${JSON.parse(Storage.localStorage.get('userInfo')).userId}`).subscribe(data => {
                if (data.code == 0) {
                    let _obj: any = data.user
                    let _userType: any = _obj.userType,
                        _userId : any = _obj.userId, 
                        userInfoArr : any = _obj.userInfo,
                        _deptId : any,
                        _deptType: any,
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
                    Storage.localStorage.remove('registrationId')
                    this.navController.navigateForward(['login'])
                }
            })
        }
    }

    permissions() {
        this.getWritePermission()
        this.getFilePermission()
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            result => {
                if (!result.hasPermission) {
                    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE])
                }
            },
            err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE])
        )

        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.GET_ACCOUNTS).then(res => {
            if (!res.hasPermission) {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.GET_ACCOUNTS)
            }
        }, err => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.GET_ACCOUNTS)
        })
    }

    //读写权限
    getWritePermission() {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(write => {
            if (!write.hasPermission) {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            }
        }, err => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
        })
    }

    //文件系统权限
    getFilePermission() {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MOUNT_UNMOUNT_FILESYSTEMS).then(write => {
            if (!write.hasPermission) {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MOUNT_UNMOUNT_FILESYSTEMS)
            }
        }, err => {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MOUNT_UNMOUNT_FILESYSTEMS)
        })
    }

    @HostListener('document:ionBackButton', ['$event'])
    public overrideHardwareBackAction($event : any) {
        $event.detail.register(100, async () => {
            if (this.router.url == '/tabs/infomation' || this.router.url == '/tabs/teaching' || this.router.url == '/tabs/analysis' || this.router.url == '/tabs/mycenter') {
                if (!this.exitapp) {
                    this.helper.message('再按一次退出应用程序', 'b', 2000)
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
            }else if (this.router.url == '/login')  {
                this.native.appMinimize()
            }else {
                this.navController.back()
            }
        })
    }
}
