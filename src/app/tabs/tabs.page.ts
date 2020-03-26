import { Component,OnInit } from '@angular/core';
import { Storage } from '../providers/Storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    public userInfo : any
    constructor(
        public storage : Storage
    ) {}
    ngOnInit() {
        this.userInfo = JSON.parse(Storage.localStorage.get('userInfo'))
    }
    ionViewWillEnter(){
        // console.log(JSON.parse(Storage.localStorage.get('userInfo')))
        this.userInfo = JSON.parse(Storage.localStorage.get('userInfo'))
        // console.log(this.userInfo,'userInfouserInfouserInfouserInfouserInfouserInfo')
    }
}
