import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.page.html',
  styleUrls: ['./teaching.page.scss'],
})
export class TeachingPage implements OnInit {
    public menuList: Array<any>
    public weekDay: String
    public currentTimeTable: Array<any>

    constructor(public router: Router) {
        this.menuList = [{
            label: '课程表',
            url: '../../assets/img/image6.png'
        },{
            label: '纳智传屏',
            url: '../../assets/img/image7.png'
        },{
            label: '设备报修',
            url: '../../assets/img/image2.png'
        },{
            label: '远程巡课',
            url: '../../assets/img/image9.png'
        },{
            label: '视频会议',
            url: '../../assets/img/image5.png'
        },{
            label: '教师云盘',
            url: '../../assets/img/image1.png'
        },{
            label: '家校互动',
            url: '../../assets/img/image8.png'
        },{
            label: '更多功能',
            url: '../../assets/img/image16.png'
        }]

        this.weekDay = '星期' + '日一二三四五六'.charAt(new Date().getDay())

        this.currentTimeTable = [{
            order: '第三节',
            classTime: '08:50-09:30',
            courseName: '语文',
            className: '高一（10）班'
        },{
            order: '第四节',
            classTime: '08:50-09:30',
            courseName: '数学',
            className: '高一（10）班'
        },{
            order: '第五节',
            classTime: '08:50-09:30',
            courseName: '中国近代史纲要',
            className: '高一（10）班'
        }]
    }

    ngOnInit() {
    }

    linkTo(item) {
        if (item.label == '课程表') {
            this.router.navigate(['/tabs/teaching/time-table'])
        }
    }

}
