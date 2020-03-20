import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { HttpServiceService } from '../../../../services/http-service.service'
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-punch-detail',
  templateUrl: './punch-detail.page.html',
  styleUrls: ['./punch-detail.page.scss'],
})
export class PunchDetailPage implements OnInit {
    public baseApi: String = environment.fileServerUrl
    public index: Number
    public isExpand: Boolean
    public audioUrl: String;
    public videoUrl: String;
    public infoId: String
    public detailObj: Object | any
    public images: Array<String>
    public clockList: Array<Object>
    public myClockInList: Array<Object>
    public notClockInList: Array<Object>
    public exerciseState: Number
    constructor(
        public route: ActivatedRoute,
        public http: HttpServiceService
    ) {
        this.index = 0
        this.isExpand = false
        this.audioUrl = ''
        this.videoUrl = ''
        this.infoId = ''
        this.detailObj = {
            audioAddress: '',
            videoAddress: '',
            detailInfo: '',
            themeName: '',
            createDate: '',
            endDate: '',
            alreadyClock: 0
        }
        this.images = []
        this.clockList = []
        this.myClockInList = []
        this.notClockInList = []
        this.exerciseState = 0
    }

    changeTab(index) {
        this.index = index
        if (index == 0) {
            this.clockList = this.myClockInList
        }else {
            this.clockList = this.notClockInList
        }
    }

    handleExpand() {
        this.isExpand = !this.isExpand
    }

    getDetailById() {
        this.http.post('clockIn/queryInfo', {
            infoId: this.infoId,
            exerciseState: this.exerciseState
        }).subscribe(res => {
            if (res.code == 0) {
                this.detailObj = res.list[0]
                res.list[0].pictureAddress && (this.images = res.list[0].pictureAddress.split(','))
                this.myClockInList = res.list[0].myClockInList || []
                this.notClockInList = res.list[0].classClockInList || []
                this.clockList = this.myClockInList
            }
        })
    }

    handleFlower(detailsId) {
        this.http.post('clockIn/addLike', {
            infoId: this.infoId,
            detailsId: detailsId
        }).subscribe(res => {
            if (res.code == 0) {
                this.getDetailById()
            }
        })
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.infoId = res.id
            this.exerciseState = res.exerciseState
            this.getDetailById()
        })
    }

}
