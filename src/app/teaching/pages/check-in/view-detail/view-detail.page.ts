import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { HttpServiceService } from '../../../../services/http-service.service'
import { environment } from '../../../../../environments/environment'
import { Helper } from '../../../../providers/Helper'
import { InputDialogComponent } from '../../../modules/input-dialog/input-dialog.component'
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopperMenuComponent } from '../../../modules/popper-menu/popper-menu.component'

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.page.html',
  styleUrls: ['./view-detail.page.scss'],
})
export class ViewDetailPage implements OnInit {

    public baseApi: String = environment.fileServerUrl
    public index: Number
    public isExpand: Boolean
    public audioUrl: String;
    public videoUrl: String;
    public infoId: String
    public detailObj: Object | any
    public images: Array<String>
    public clockList: Array<Object>
    public notClockInList: Array<Object>
    public popper: Boolean;
    public exerciseState: Number;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpServiceService,
        public helper: Helper,
        public modal: ModalController,
        public popoverController: PopoverController
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
        this.notClockInList = []
        this.popper = false
        this.exerciseState = 0
    }

    async openPopper() {
        this.popper = !this.popper
        // const popover = await this.popoverController.create({
        //     component: PopperMenuComponent,
        //     translucent: false
        // });
        // await popover.present();
    }

    

    changeTab(index) {
        this.index = index
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
                this.clockList = res.list[0].clockInList || []
                this.notClockInList = res.list[0].notClockInList || []
            }
        })
    }

    deletePunch() {
        this.helper.alert('提示', '请确认是否删除当前打卡活动？', () => {
            this.http.get(`clockIn/delete?infoId=${this.infoId}`).subscribe(res => {
                this.helper.message('删除成功！')
                this.router.navigate(['/check-in'])
            })
        })
    }

    stopPunch() {
        this.helper.alert('提示', '请确认是否结束当前打卡活动，结束后，活动不可开始。', () => {
            this.http.get(`clockIn/endInfo?infoId=${this.infoId}`).subscribe(res => {
                this.helper.message('成功结束！')
                this.router.navigate(['/check-in'])
            })
        }, () => {})
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

    async turnDown(detailsId, isReject, index) {
        if (isReject != 2) {
            const modal = await this.modal.create({
                component: InputDialogComponent,
                cssClass: 'turn-input-class',
            })
            await modal.present();
            const { data } = await modal.onWillDismiss();
            this.http.post('clockIn/reject', {
                detailsId: detailsId,
                reject: data.reject
            }).subscribe(res => {
                if (res.code == 0) {
                    this.getDetailById()
                    this.helper.message('驳回成功')
                } 
            })
        }
    }

    handleRemind() {
        this.http.post('clockIn/queryRemind', {
            infoId: this.infoId
        }).subscribe(res => {
            if (res.code == 0) {
                this.helper.alert('一键提醒', `${this.detailObj.themeName}打卡活动，今日未打卡${res.list.notClockInNum}人，今日已提醒${res.list.remindNum}次。`, () => {
                    if (res.list.notClockInNum != 0) {
                        this.http.post('clockIn/remind', {
                            infoId: this.infoId,
                            title: this.detailObj.themeName,
                            content: this.detailObj.detailInfo,
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
        this.route.queryParams.subscribe(res => {
            this.infoId = res.id
            this.exerciseState = res.exerciseState
            this.getDetailById()
        })
    }

}
