import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceService } from '../services/http-service.service'
import { Storage } from '../providers/Storage'
import { Helper } from '../providers/Helper'

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.page.html',
  styleUrls: ['./teaching.page.scss'],
})
export class TeachingPage implements OnInit {
    public menuList: Array<any>
    public weekDay: String
    public currentTimeTable: Array<any>
    public isFirst: Boolean = false

    public isHaveMine: Boolean = false
    public isHaveClass: Boolean = false
    public isHaveTeacher: Boolean = false

    public labelName: String = '我的课表'

    constructor(
        public router: Router,
        public http: HttpServiceService,
        public helper: Helper) {
        this.menuList = [{
            label: '课程表',
            url: 'assets/img/kechengbiao.png'
        },{
            label: '纳智传屏',
            url: '/assets/img/nazhichuanping.png'
        },{
            label: '学生档案',
            url: 'assets/img/xueshengdangan.png'
        },{
            label: '家校互动',
            url: 'assets/img/jiaoxiaohudong.png'
        },{
            label: '教师云盘',
            url: 'assets/img/jiaoshiyunpan.png'
        },{
            label: '屏幕广播',
            url: 'assets/img/pingmuguangbo.png'
        },{
            label: '德育管理',
            url: 'assets/img/deyuguanli.png'
        },{
            label: '生涯规划',
            url: 'assets/img/shengyaguihua.png'
        }]

        this.weekDay = '星期' + '日一二三四五六'.charAt(new Date().getDay())

        this.currentTimeTable = []

        let menuIds = JSON.parse(Storage.localStorage.get('menuList'))
        if (menuIds.length) {
            menuIds[0].menuIds.indexOf('10009') > -1 && (this.isHaveMine = true)
            menuIds[0].menuIds.indexOf('10010') > -1 && (this.isHaveClass = true)
            menuIds[0].menuIds.indexOf('10013') > -1 && (this.isHaveTeacher = true)
        }
    }

    ngOnInit() {
        this.isHaveMine && (this.getmineTable())
        !this.isHaveMine && this.isHaveClass && (this.getclassTable())
    }

    linkTo(item) {
        if (item.label == '课程表') {
            this.router.navigate(['/time-table'])
        }else {
            this.helper.message('功能正在升级中', 'b')
        }
    }

    getmineTable() {
        this.http.post('eduManageCourse/getCourse', {
            weekDay: new Date().getDay() + '',
            userId: Storage.localStorage.get('userId')
        }).subscribe(res => {
            if (res.code == 0) {
                if (res.list.length) {
                    this.getFirstThree(res.list)
                    this.labelName = '我的课表'
                }else if (this.isHaveClass) {
                    this.labelName = '班级课表'
                    this.getclassTable()
                }
            }
        })
    }

    getclassTable() {
        this.http.get('common/queryGradeList').subscribe(res => {
            if (res.code == 0) {
               this.http.get('common/queryClassList', {
                    gradeId: res.list[0].gradeId
                }).subscribe(res1 => {
                    if (res1.code == 0) {
                        this.http.post('eduManageCourse/getCourse', {
                            weekDay: new Date().getDay() + '',
                            gradeId: res.list[0].gradeId,
                            classId: res1.list[0].classId
                        }).subscribe(res2 => {
                            if (res2.code == 0) {
                                this.getFirstThree(res2.list)
                            }
                        })
                    }
                })
            }
        })
    }

    getFirstThree(list) {
        let _tableArr = []
        _tableArr = list
        let hour = new Date().getHours(), minutes = new Date().getMinutes(), arr = []
        let curr = hour + minutes / 60
        for (let i = 0; i < _tableArr.length; i ++) {
            let startArr = _tableArr[i].startTime.split(':'), endArr = _tableArr[i].endTime.split(':')
            let startVal = parseInt(startArr[0]) + parseInt(startArr[1]) / 60,
                endVal = parseInt(endArr[0]) + parseInt(endArr[1]) / 60
            if (curr < startVal || ( curr > startVal && curr < endVal)) {
                if (i == 0) {
                    this.currentTimeTable = _tableArr.slice(0, 3)
                    this.isFirst = true
                }else {
                    this.currentTimeTable = _tableArr.slice(i - 1, 3)
                    this.isFirst = false
                }
                break
            }
        }
    }
}
