import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';

import { Storage } from '../../providers/Storage'
import { HttpServiceService } from '../../services/http-service.service'
import { Helper } from '../../providers/Helper'
import { EventService } from '../../services/event.service'

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.page.html',
  styleUrls: ['./update-info.page.scss'],
})
export class UpdateInfoPage {
    public title : String
    public type : String
    public userInfo : any
    public sex : any
    public schoolInfo : any = { img : '', backgroundPicture : '', slogan : '' }
    public classInfo :any
    constructor(
        public route : ActivatedRoute,
        public router : Router, 
        public http : HttpServiceService,
        public helper : Helper,
        public navController : NavController,
        public eventService : EventService) { }

    ngOnInit() {
        this.route.queryParams.subscribe((res : any) => {
            this.type = res.type
            this.type == '1' && (this.title = '修改个性签名')
            this.type == '2' && (this.title = '修改用户名')
            this.type == '3' && (this.title = '修改真实姓名')
            this.type == '4' && (this.title = '修改性别')
            this.type == '5' && (this.title = '修改手机号')
            this.type == '6' && (this.title = '修改邮箱')
            if (this.type == '7') {
                this.title = '修改学校口号'
                res.info && (this.schoolInfo = JSON.parse(res.info))

            }
            if (this.type == '8') {
                this.title = '修改班级口号'
                res.info && (this.classInfo = JSON.parse(res.info))
            }
        })
        let info = JSON.parse(Storage.localStorage.get('userInfo'))
        info.sex ? this.sex = info.sex + '' : this.sex = info.sex
        this.userInfo = info
    }

    updateInfo() {
        if (this.type == '7') {
            this.http.post('WechatAppletTeaching/update/schoolInfo', this.schoolInfo).subscribe(res => {
                if (res.code == 0) {
                    this.navController.back()
                }
            })
        }else if (this.type == '8') {
            this.http.post('WechatAppletTeaching/update/info', this.classInfo).subscribe(res => {
                if (res.code == 0) {
                    let obj : NavigationExtras = {
                        queryParams : {
                            type : 3,
                            classInfo : JSON.stringify(this.classInfo)
                        }
                    }
                    this.router.navigate(['/setting'], obj)
                }
            })
        }else {
            if (this.type == '5' && !/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(this.userInfo.mobile)) {
                this.helper.message('手机号有误！')
                return
            }
            if (this.type == '6' && !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(this.userInfo.email)) {
                this.helper.message('邮箱有误！')
                return
            }
            let obj = {
                userId : this.userInfo.userId,
                username : this.userInfo.username,
                fullName : this.userInfo.fullName,
                imageUrl : this.userInfo.imageUrl,
                sex : this.sex + '',
                backgroundPicture : '',
                mobile : this.userInfo.mobile,
                email : this.userInfo.email,
                sign : this.userInfo.sign
            }
            this.http.put('wechatApplet/update', obj).subscribe(res => {
                if (res.code == 0) {
                    Storage.localStorage.set('userInfo', JSON.stringify(this.userInfo))
                    this.eventService.event.emit('useraction')
                    this.navController.back()
                }else {
                    this.helper.message(res.msg)
                }
            })
        }
    }

}
