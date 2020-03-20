import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../../../services/http-service.service'
import { Helper } from '../../../providers/Helper'

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
})
export class CheckInPage implements OnInit {
    public index: Number
    public doingData: any;
    public page: any;
    public size: any;
    
    constructor(
        public http: HttpServiceService,
        public helper: Helper
    ) {
        this.index = 0
        this.doingData = []
        this.page = 1
        this.size = 10
    }

    changeTab(index) {
        this.index = index
        this.getDoneData()
    }

    getDoneData() {
        this.page = 1
        this.http.post('clockIn/queryInfo', {
            page: this.page,
            limit: this.size,
            exerciseState: this.index
        }).subscribe(res => {
            if (res.code == 0) {
                this.doingData = res.page.list
                this.page ++
            }
        })
    }

    loadData(event) {
        this.http.post('clockIn/queryInfo', {
            page: this.page,
            limit: this.size,
            exerciseState: this.index
        }).subscribe(res => {
            if (res.code == 0) {
                this.doingData = this.doingData.concat(res.page.list) 
                this.page ++
                event.target.complete()
            }
        })
    }

    refreshPersonMess(event) {
        this.page = 1
        this.http.post('clockIn/queryInfo', {
            page: this.page,
            limit: this.size,
            exerciseState: this.index
        }).subscribe(res => {
            if (res.code == 0) {
                this.doingData = res.page.list
                this.page ++
                event.target.complete()
            }
        })
    }

    handleRemind(infoId, themeName, detailInfo) {
        this.http.post('clockIn/queryRemind', {
            infoId: infoId
        }).subscribe(res => {
            if (res.code == 0) {
                this.helper.alert('一键提醒', `${themeName}打卡活动，今日未打卡${res.list.notClockInNum}人，今日已提醒${res.list.remindNum}次。`, () => {
                    if (res.list.notClockInNum != 0) {
                        this.http.post('clockIn/remind', {
                            infoId: infoId,
                            title: themeName,
                            content: detailInfo,
                            userIdList: res.list.notClockInList
                        }).subscribe(value => {
                            if (value.code == 0) {
                                this.helper.message('提醒成功')
                            }
                        })
                    }
                }, () => {})
            }
        })
        
    }

    ngOnInit() {
        this.getDoneData()
    }

}
