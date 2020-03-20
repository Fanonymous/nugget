import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';

import { HttpServiceService } from '../../../../services/http-service.service'
import { Helper } from '../../../../providers/Helper'
import { environment } from '../../../../../environments/environment'
import { ModalController } from '@ionic/angular'
import { KeyboardComponent } from '../../../modules/keyboard/keyboard.component'

@Component({
  selector: 'app-submit-comment',
  templateUrl: './submit-comment.page.html',
  styleUrls: ['./submit-comment.page.scss'],
})
export class SubmitCommentPage implements OnInit {
    public baseApi: String = environment.fileServerUrl
    public detailObj: any
    public infoId: String
    public detailsId: any
    public index: Number

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpServiceService,
        public modalController: ModalController,
        public helper: Helper
    ) { 
        this.detailObj = {}
        this.detailsId = ''
        this.infoId = ''
        this.index = 0
    }
    
    changeTab(index) {
        this.index = index
    }

    getDetailById() {
        this.http.post('clockIn/queryDetails', {
            detailsId: this.detailsId
        }).subscribe(res => {
            if (res.code == 0) {
                this.detailObj = res.list
                this.infoId = res.list.infoId
                console.log(this.infoId)
            }
        })
    }

    async writeComment() {
        const modal = await this.modalController.create({
            component: KeyboardComponent,
            cssClass: 'keyboard-comment',
        })
        await modal.present();
        const { data } = await modal.onWillDismiss()
        this.http.post('clockIn/addEvaluation', {
            infoId: this.infoId,
            detailsId: this.detailsId,
            evaluation: data.commentVal
        }).subscribe(res => {
            if (res.code == 0) {
                this.helper.message('评论成功！')
                this.getDetailById()
            }
        })
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.detailsId = res.id
            this.getDetailById()
        })
    }

}
