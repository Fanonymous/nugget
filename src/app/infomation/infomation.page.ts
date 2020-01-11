import { Component, OnInit } from '@angular/core';

import { Helper } from '../providers/Helper'

@Component({
  selector: 'app-infomation',
  templateUrl: './infomation.page.html',
  styleUrls: ['./infomation.page.scss'],
})
export class InfomationPage implements OnInit {

  constructor(public helper: Helper) { }

  ngOnInit() {
  }

  handleClick() {
      this.helper.alert('温馨提示', '已有绑定<span class="aaaaa">aaaa</span>', () => {}, () => {}, 'my-alert1')
  }

}
