import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { Helper } from '../providers/Helper'
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    public exitapp : Boolean = false
    constructor(
        public platform : Platform,
        public navController : NavController,
        public router : Router,
        public helper : Helper) {}

    ngOnInit(): void {
        // this.platform.backButton.subscribe(() => {
        //    alert(this.router.url)
        //     if (this.router.url === '/tabs/infomation' || this.router.url == '/tabs/teaching' || this.router.url == '/tabs/analysis' || this.router.url == '/tabs/mycenter') {
        //         if (!this.exitapp) {
        //             this.helper.message('再按一次退出应用程序')
        //             this.exitapp = true
        //             let timer = setTimeout(() => {
        //                 this.exitapp = false
        //                 clearTimeout(timer)
        //                 timer = null
        //             }, 2000)
        //             return
        //         }
        //         this.exitapp = false
        //         navigator['app'].exitApp()
        //     }
        // })
    }

}
