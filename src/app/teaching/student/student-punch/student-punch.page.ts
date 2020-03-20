import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../../../services/http-service.service'

@Component({
  selector: 'app-student-punch',
  templateUrl: './student-punch.page.html',
  styleUrls: ['./student-punch.page.scss'],
})
export class StudentPunchPage implements OnInit {
    public index: Number
    public doingData: any;
    public page: any;
    public size: any;

    constructor(
        public http: HttpServiceService
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

    ngOnInit() {
        this.getDoneData()
    }

}
