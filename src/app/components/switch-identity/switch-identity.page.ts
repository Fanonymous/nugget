import { Component, OnInit } from '@angular/core';

import { Storage } from '../../providers/Storage'
import { EventService } from '../..//services/event.service'
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-switch-identity',
  templateUrl: './switch-identity.page.html',
  styleUrls: ['./switch-identity.page.scss'],
})
export class SwitchIdentityPage implements OnInit {
    public info : any
    public userType : any

    constructor(
        public eventService : EventService,
        public navController : NavController) { }

    ngOnInit() {
        this.info = JSON.parse(Storage.localStorage.get('userInfo')).userInfo
        this.userType = Storage.localStorage.get('userType')
    }

    switchType(n) {
        let obj = JSON.parse(Storage.localStorage.get('userInfo'))
        obj.userType = n
        let userArr = obj.userInfo, _deptId : any
        for (let item of userArr) {
            if (item.userType == n) {
                _deptId = item.deptIds
                break
            }
        }
        Storage.localStorage.set('userInfo', JSON.stringify(obj))
        Storage.localStorage.set('userType', n)
        Storage.localStorage.set('deptId', _deptId)
        this.eventService.event.emit('useraction')
        this.navController.back()
    }

}
