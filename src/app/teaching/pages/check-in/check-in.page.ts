import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss'],
})
export class CheckInPage implements OnInit {
    public index: Number
    constructor() {
        this.index = 1
    }

    changeTab(index) {
        this.index = index
    }

    ngOnInit() {
    }

}
