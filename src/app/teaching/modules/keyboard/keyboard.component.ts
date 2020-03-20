import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent implements OnInit {
    public baseApi: String = environment.fileServerUrl
    public commentVal: String
    constructor(
        public keyboard: Keyboard,
        public navParams: NavParams
    ) { 
        this.commentVal = ''
    }

    handleSend() {
        this.navParams.data.modal.dismiss({
            commentVal: this.commentVal
        })
    }

    ngAfterViewInit() {
        this.keyboard.show()
    }

    ngOnInit() {        
        
    }

}
