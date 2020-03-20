import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent implements OnInit {
    public reject: String

    constructor(
        public navParams: NavParams,
    ) {
        this.reject = ''
     }

    cancel() {
        this.navParams.data.modal.dismiss()
    }

    confirm() {
        this.navParams.data.modal.dismiss({
            reject: this.reject
        })
    }

    ngOnInit() {}

}
