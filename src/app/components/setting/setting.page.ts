import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';


import { environment } from '../../../environments/environment'
import { Storage } from '../../providers/Storage'
import { NativeService } from '../../providers/NativeService'
import { camera } from '../../providers/camera'
import { HttpServiceService } from '../../services/http-service.service'
import { FileService } from '../../providers/FileService'
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Helper } from '../../providers/Helper'
import { EventService } from '../..//services/event.service'

@Component({
    selector: 'app-setting',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
    public baseApi : any = environment.fileServerUrl
    public userInfo : any
    public url : any = '../../../assets/img/avatar.png'
    public name : any = ''
    public realName : any = ''
    public sex :any = '请选择'
    public sign : any = '请输入'
    public phone : any = '请输入'
    public email : any = '请输入'
    public type : String = ''
    public title : String = '个人信息'

    public schoolAvater : String = '../../../assets/img/avatar.png'
    public schoolBackground : String = '../../../assets/img/avatar.png'
    public schoolSlogan : String = '请输入'
    public schoolInfo : any

    public className : any
    public classAvater : String = '../../../assets/img/avaclass.png'
    public classBackground : String = '../../../assets/img/avaclass.png'
    public classSlgon : String = '请输入'
    public classInfo : any
    public classObj : any = {}
    public classTemp : any



    constructor(
        public route : ActivatedRoute, 
        public router : Router,
        public actionSheetCtrl : ActionSheetController,
        public nativeService : NativeService,
        public camera : camera,
        public http : HttpServiceService,
        public fileService : FileService,
        public helper : Helper,
        public eventService : EventService) { }

    ngOnInit() {
        this.initUserInfo()
        this.route.queryParams.subscribe(res => {
            this.type = res.type
            this.type == '1' && (this.title = '个人信息')
            this.type == '2' && (this.title = '我的学校', this.getSchoolData())
            this.type == '3' && (this.title = '我的班级', this.getClassData())
            this.type == '4' && (this.title = '关于纳智')
            res.classInfo && (this.classTemp = JSON.parse(res.classInfo))
        })
        this.eventService.event.on('useraction', () => {
            this.initUserInfo()
        }) 
    }

    getSchoolData() {
        this.http.get('WechatAppletTeaching/schoolInfo').subscribe(res => {
            if (res.code == 0 && res.list.length) {
                if (res.list[0].page) {
                    let obj = res.list[0].page
                    this.schoolInfo = obj
                    obj.img && (this.schoolAvater = this.baseApi + obj.img)
                    obj.backgroundPicture && (this.schoolBackground = this.baseApi + obj.backgroundPicture)
                    obj.slogan && (this.schoolSlogan = obj.slogan)
                }else {
                    this.schoolInfo = { img : '', backgroundPicture : '', slogan : '', deptInfoId : 0, deptId : Storage.localStorage.get('deptId'), userId : Storage.localStorage.get('userId')}
                }
            }
        })
    }

    getClassData() {
        this.http.get('WechatAppletTeaching/headmasterClassList').subscribe(res => {
            if (res.code == 0) {
                this.classInfo = res.list
                let obj =this.classTemp || res.list[0]
                this.className = obj.classId
                obj.img && (this.classAvater = this.baseApi + obj.img)
                obj.backgroundPicture && (this.classBackground = this.baseApi + obj.backgroundPicture)
                obj.slogan && (this.classSlgon = obj.slogan)
                for (let item of this.classInfo) {
                    this.classObj[item.classId] = item
                }
            }else {
                this.helper.message(res.msg)
            }
        })
    }

    handleSelect(classId) {
        let obj = this.classObj[classId] || this.classObj[this.className]
        obj.img ? this.classAvater = this.baseApi + obj.img : this.classAvater = '../../../assets/img/avaclass.png'
        obj.backgroundPicture ? this.classBackground = this.baseApi + obj.backgroundPicture : this.classBackground = '../../../assets/img/avaclass.png'
        obj.slogan ? this.classSlgon = obj.slogan : this.classSlgon = '请输入'
    }


    initUserInfo() {
        let info = JSON.parse(Storage.localStorage.get('userInfo'))
        this.userInfo = info
        info.imageUrl && (this.url = this.baseApi + info.imageUrl)
        this.name = info.username
        this.realName = info.fullName
        info.sex && (this.sex = info.sex == 1 ? '男' : '女')
        info.sign && (this.sign = info.sign)
        info.mobile && (this.phone = info.mobile)
        info.email && (this.email = info.email)
    }

    async addPicture(num, type) {
        const self = this
        const actionSheet = await this.actionSheetCtrl.create({
            cssClass  : 'choise--album',
            buttons: [
                {
                    text: '从相册选择',
                    handler: () => {
                        self.camera.getMultiplePicture({
                            maximumImagesCount: 1,
                            destinationType: 0
                        }).subscribe(img => {
                            if (num == 1) {
                                this.saveSchoolInfo(img[0], type)
                            }else if (num == 2) {
                                this.saveClassInfo(img[0], type)
                            }else {
                                this.saveUserInfo(img[0])
                            }
                        });
                    }
                },
                {
                    text: '拍照',
                    handler: () => {
                        self.camera.getPicture({ destinationType : 0 }).subscribe(img => {
                            if (num == 1) {
                                this.saveSchoolInfo(img, type)
                            }else if (num == 2) {
                                this.saveClassInfo(img, type)
                            }else {
                                this.saveUserInfo(img)
                            }
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
                        username : this.userInfo.username,
                        sex : this.userInfo.sex
                    }
                    return this.http.post('uc/user/update', obj)
                }else {
                    this.helper.message(url.msg)
                    return of(-1)
                }
            })).subscribe(res => {
                if (res.code == 0) {
                    this.http.get(`uc/user/userInfo?userId=${this.userInfo.userId}`).subscribe(data => {
                        if (data.code == 0) {
                            Storage.localStorage.set('userInfo', JSON.stringify(data.user))
                            this.eventService.event.emit('useraction');
                        }else {
                            this.helper.message(res.msg)
                        }
                    })
                }else {
                    this.helper.message(res.msg)
                }
        })
    }

    saveSchoolInfo(img, num) {
        this.getPictureSuccess(img).pipe(
            mergeMap(url => {
                if (url.code == 0) {
                    if (num == 1) {
                        this.schoolAvater = this.baseApi + url.url
                    }else {
                        this.schoolBackground = this.baseApi + url.url
                    }
                    let obj = {
                        img : num == 1 ? url.url : this.schoolInfo.img,
                        backgroundPicture : num == 2 ? url.url : this.schoolInfo.backgroundPicture,
                        slogan : this.schoolInfo.slogan,
                        deptInfoId : this.schoolInfo.deptInfoId,
                        deptId : Storage.localStorage.get('deptId'),
                        userId : Storage.localStorage.get('userId')
                    }
                    return this.http.post('WechatAppletTeaching/update/schoolInfo', obj)
                }else {
                    this.helper.message(url.msg)
                    return of(-1)
                }
            })).subscribe(res => {
                if (res.code == 0) {
                    if (num == 1) {
                        this.schoolInfo.img = this.schoolAvater.split('?fileName=')[1]
                    }else {
                        this.schoolInfo.backgroundPicture = this.schoolBackground.split('?fileName=')[1]
                    }
                }else {
                    this.helper.message(res.msg)
                }
            })
    }

    saveClassInfo(img, num) {
        this.getPictureSuccess(img).pipe(
            mergeMap(url => {
                if (url.code == 0) {
                    if (num == 1) {
                        this.classAvater = this.baseApi + url.url
                    }else {
                        this.classBackground = this.baseApi + url.url
                    }
                    let obj = {
                        classId : this.className,
                        gradeId : this.classObj[this.className].gradeId,
                        img : num == 1 ? url.url : this.classObj[this.className].img,
                        backgroundPicture : num == 2 ? url.url : this.classObj[this.className].backgroundPicture,
                        slogan : this.classObj[this.className].slogan,
                        gradeClassInfoId : this.classObj[this.className].gradeClassInfoId
                    }
                    return this.http.post('WechatAppletTeaching/update/info', obj)
                }else {
                    this.helper.message(url.msg)
                    return of(-1)
                }
            })).subscribe(res => {
                if (res.code == 0) {
                    if (num == 1) {
                        this.classObj[this.className].img = this.classAvater.split('?fileName=')[1]
                    }else {
                        this.classObj[this.className].backgroundPicture = this.classBackground.split('?fileName=')[1]
                    }
                }else {
                    this.helper.message(res.msg)
                }
        })
    }

    baseLink(num) {
        let obj : NavigationExtras = {
            queryParams : {
                type : num == 1 ? 7 : 8,
                info : num == 1 ? JSON.stringify(this.schoolInfo) : JSON.stringify(this.classObj[this.className])
            }
        }
        this.router.navigate(['/update-info'], obj)
    }

}
