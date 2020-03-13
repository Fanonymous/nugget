import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../../../services/http-service.service'

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
})
export class CheckInPage implements OnInit {
    public index: Number
    public doingData: any;
    constructor(
        public http: HttpServiceService
    ) {
        this.index = 1
        this.doingData = []
    }

    changeTab(index) {
        this.index = index
    }

    getDoneData() {
        this.http.post('clockIn/queryInfo').subscribe(res => {
            console.log(res)
            if (res.code == 0) {
                this.doingData = res.list
            }
        })
    }

    ngOnInit() {
        this.getDoneData()
    }

}
