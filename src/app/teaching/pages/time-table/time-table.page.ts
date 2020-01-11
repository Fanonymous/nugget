import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.page.html',
  styleUrls: ['./time-table.page.scss'],
})
export class TimeTablePage implements OnInit {
    public index: Number
    public currentTimeTable: Array<any>
    constructor() { 
        this.index = 1

        this.currentTimeTable = [{
            order: '第三节',
            classTime: '08:50-09:30',
            courseName: '语文',
            className: '高一（10）班'
        },{
            order: '第四节',
            classTime: '08:50-09:30',
            courseName: '数学',
            className: '高一（10）班'
        },{
            order: '第五节',
            classTime: '08:50-09:30',
            courseName: '中国近代史纲要',
            className: '高一（10）班'
        }]
    }

    ngOnInit() {
    }

}
