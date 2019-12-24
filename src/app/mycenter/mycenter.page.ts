import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router, NavigationExtras} from '@angular/router';

import { Storage } from '../providers/Storage';

import { environment } from '../../environments/environment'
import { HttpServiceService } from '../services/http-service.service'
import { Helper } from '../providers/Helper'
import { NavController } from '@ionic/angular';
import { camera } from '../providers/camera'
import { FileService } from '../providers/FileService'
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EventService } from '../services/event.service'

@Component({
  selector: 'app-mycenter',
  templateUrl: './mycenter.page.html',
  styleUrls: ['./mycenter.page.scss'],
})
export class MycenterPage {
    public baseApi : any = environment.fileServerUrl
    public userInfo : any
    public isSwitch : Boolean = false
    public name : any = ''
    public url : any = '../../assets/img/avatar.png'
    public sign : any = '个性签名'
    public isHaveSchool : Boolean = false
    public isHaveClass : Boolean = false


    constructor(
        public actionSheetController : ActionSheetController, 
        public http : HttpServiceService, 
        public helper : Helper,
        public navController : NavController,
        public camera : camera,
        public fileService : FileService,
        public eventService : EventService,
        public router : Router) { }

    ngOnInit() {
        this.initUserInfo()
        this.eventService.event.on('useraction', () => {
            this.getMenuList()
        })
    }

    getMenuList() {
        this.http.get('WechatAppletAnalysis/getProductByRole').subscribe(res => {
            if (res.code == 0) {
                Storage.localStorage.set('menuList', JSON.stringify(res.list))
                this.initUserInfo()
            }
        })
    }

    initUserInfo () {
        let info = JSON.parse(Storage.localStorage.get('userInfo'))
        this.userInfo = info
        this.name = info.username
        info.imageUrl && (this.url = this.baseApi + info.imageUrl)
        info.sign && (this.sign = info.sign)
        info.userInfo.length > 1 && (this.isSwitch = true)
        let menuIds = JSON.parse(Storage.localStorage.get('menuList'))
        if (menuIds.length) {
            menuIds[0].menuIds.indexOf('10006') > -1 && (this.isHaveSchool = true)
            menuIds[0].menuIds.indexOf('10007') > -1 && (this.isHaveClass = true)
        }else {
            this.isHaveSchool = false
            this.isHaveClass = false
        }
    }

    async logout() {
        let self = this
        const actionSheet = await this.actionSheetController.create({
            header: '退出后不会删除任何历史数据',
            cssClass : 'sheet-logout',
            buttons: [{
                text: '退出登录',
                role : 'logout',
                handler: () => {
                    self.http.post('/sys/logout', {
                        appType : 5
                    }).subscribe(res => {
                        if (res.code == 0) {
                            Storage.localStorage.remove('token')
                            Storage.localStorage.remove('userInfo')
                            Storage.localStorage.remove('menuList')
                            Storage.localStorage.remove('deptId')
                            Storage.localStorage.remove('userType')
                            Storage.localStorage.remove('userId')
                            self.navController.navigateForward(['login'])
                        }else {
                            self.helper.toast(res.msg)
                        }
                    })
                }
            }, {
                text: '取消',
                role : 'cancel',
                handler: () => {
                    
                }
            }]
          })
          await actionSheet.present()
    }

    updatePass() {
        this.helper.toast('请联系管理员')
    }

    async addPicture() {
        const self = this
        const actionSheet = await this.actionSheetController.create({
            cssClass  : 'choise--album',
            buttons: [
                {
                    text: '从相册选择',
                    handler: () => {
                        self.camera.getMultiplePicture({
                            maximumImagesCount: 1,
                            destinationType: 0
                        }).subscribe(img => {
                            this.saveUserInfo(img[0])
                        });
                    }
                },
                {
                    text: '拍照',
                    handler: () => {
                        self.camera.getPicture({ destinationType : 0 }).subscribe(img => {
                            this.saveUserInfo(img)
                        })
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        })
        await actionSheet.present()
    }

    getPictureSuccess(img) {
        let obj = this.fileService.base64ToFile(img), formData : FormData = new FormData()
        formData.append('file', obj)
        formData.append('type', '.PNG')
        return this.http.postFormData('sys/oss/picUpload', formData)
    }

    saveUserInfo(img) {
        this.getPictureSuccess(img).pipe(
            mergeMap(url => {
                if (url.code == 0) {
                    this.url = this.baseApi + url.url
                    let obj = {
                        email : this.userInfo.email,
                        fullName : this.userInfo.fullName,
                        imageUrl : url.url,
                        mobile : this.userInfo.mobile,
                        sign : this.userInfo.sign,
                        userId : this.userInfo.userId,
                        userNum : this.userInfo.userNum,
                        username : this.userInfo.username
                    }
                    return this.http.post('uc/user/update', obj)
                }else {
                    this.helper.toast(url.msg)
                    return of(-1)
                }
            })).subscribe(res => {
                if (res.code == 0) {
                    this.http.get(`uc/user/userInfo?userId=${this.userInfo.userId}`).subscribe(data => {
                        if (data.code == 0) {
                            Storage.localStorage.set('userInfo', JSON.stringify(data.user))
                        }else {
                            this.helper.toast(res.msg)
                        }
                    })
                }else {
                    this.helper.toast(res.msg)
                }
        })
    }

    handleFindClass() {
        let self = this
        this.http.get('WechatAppletTeaching/headmasterClassList').subscribe(res => {
            if (res.code == 0) {
                if (res.list && res.list.length) {
                    let obj : NavigationExtras = {
                        queryParams : {
                            type : 3,
                            info : JSON.stringify(res.list)
                        }
                    }
                    self.router.navigate(['/setting'], obj)
                }else {
                    self.helper.toast('暂无班级')
                }
            }else {
                self.helper.toast(res.msg)
            }
        })
    }

}
