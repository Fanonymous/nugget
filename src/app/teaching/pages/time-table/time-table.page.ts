import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../../services/http-service.service'
import { Storage } from '../../../providers/Storage'
import { ModalController } from '@ionic/angular';
import { FilterDialogComponent } from '../../modules/filter-dialog/filter-dialog.component'

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.page.html',
  styleUrls: ['./time-table.page.scss'],
})
export class TimeTablePage implements OnInit {
    public index: Number
    public currentTimeTable: Array<any>
    public currentDay: Number

    public gradeValue: String
    public gradeName: String
    public classValue: String
    public className: String

    public subjectId: any
    public subjectName: String
    public teacherId: any
    public teacherName: String

    public isHaveMine: Boolean = false
    public isHaveClass: Boolean = false
    public isHaveTeacher: Boolean = false
    
    constructor(
        public http: HttpServiceService,
        public modal: ModalController ) {

        this.index = 1
        this.currentDay = new Date().getDay()

        this.currentTimeTable = []
        let menuIds = JSON.parse(Storage.localStorage.get('menuList'))
        if (menuIds.length) {
            menuIds[0].menuIds.indexOf('10009') > -1 && (this.isHaveMine = true)
            menuIds[0].menuIds.indexOf('10010') > -1 && (this.isHaveClass = true)
            menuIds[0].menuIds.indexOf('10013') > -1 && (this.isHaveTeacher = true)
        }
    }

    ngOnInit() {
        this.getclassTable(this.currentDay)
    }

    async handleFilter() {
        const modal = await this.modal.create({
            component: FilterDialogComponent,
            cssClass: 'filter-class',
            componentProps: {
                type: this.index,
            }
        })
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (this.index == 2 && data) {
            if (data.gradeId && data.classId) {
                this.gradeValue = data.gradeId
                this.gradeName = data.gradeName
                this.classValue = data.classId
                this.className = data.className
                this.getWeekTable()
            }
        }

        if (this.index == 3 && data) {
            if (data.subjectId && data.teacherId) {
                this.subjectId = data.subjectId
                this.subjectName = data.subjectName
                this.teacherId = data.teacherId
                this.teacherName = data.teacherName
                this.getTeacherTable()
            }
        }
    }


    changeTab(index) {
        this.index = index
        this.currentTimeTable = []
        if (index == 1) {
            this.getclassTable(this.currentDay)
        }
        if (index == 2) {
            if (!this.gradeValue && !this.classValue) {
                this.getFirstClassTable()
            }else {
                this.getWeekTable()
            }
        }
        if (index == 3) {
            if (!this.subjectId && !this.teacherId) {
                this.getFirstTeacherTable()
            }else {
                this.getTeacherTable()
            }
        }
    }

    getclassTable(week) {
        this.http.post('eduManageCourse/getCourse', {
            weekDay: week + '',
            userId: Storage.localStorage.get('userId')
        }).subscribe(res => {
            if (res.code == 0) {
                this.currentTimeTable = res.list
            }
        })
    }

    getWeekTable() {
        this.http.post('eduManageCourse/getCourse', {
            weekDay: this.currentDay + '',
            gradeId: this.gradeValue,
            classId: this.classValue
        }).subscribe(res => {
            this.currentTimeTable = res.list
        })
    }

    getTeacherTable() {
        this.http.post('eduManageCourse/getCourse', {
            weekDay: this.currentDay + '',
            teacherId: this.teacherId
        }).subscribe(res => {
            this.currentTimeTable = res.list
        })
    }

    getFirstClassTable() {
        this.http.get('common/queryGradeList').subscribe(res => {
            if (res.code == 0) {
               this.gradeValue = res.list[0].gradeId
               this.gradeName = res.list[0].gradeName
               this.http.get('common/queryClassList', {
                    gradeId: this.gradeValue
                }).subscribe(res1 => {
                    if (res1.code == 0) {
                        this.classValue = res1.list[0].classId
                        this.className = res1.list[0].className
                        this.http.post('eduManageCourse/getCourse', {
                            weekDay: this.currentDay + '',
                            gradeId: this.gradeValue,
                            classId: this.classValue
                        }).subscribe(res2 => {
                            if (res2.code == 0) {
                                this.currentTimeTable = res2.list
                            }
                        })
                    }
                })
            }
        })
    }

    getFirstTeacherTable() {
        this.http.post('eduManageSubject/list', {
            schoolId: Storage.localStorage.get('deptId'),
            page: 1,
            limit: 999
        }).subscribe(res => {
            if (res.code == 0) {
                this.subjectId = res.page.list[0].subjectId
                this.subjectName = res.page.list[0].subjectName
                this.http.get('eduManageTeachingSubject/teacherListBySubject', {
                    schoolId: Storage.localStorage.get('deptId'),
                    subjectId: this.subjectId
                }).subscribe(res1 => {
                    if (res1.code == 0) {
                        this.teacherId = res1.list[0].teacherId
                        this.teacherName = res1.list[0].teacherName
                        this.http.post('eduManageCourse/getCourse', {
                            weekDay: this.currentDay + '',
                            teacherId: this.teacherId
                        }).subscribe(res2 => {
                            this.currentTimeTable = res2.list
                        })
                    }
                })
            }
        })
    }

    changeWeek(week) {
        this.currentDay = week
        if (this.index == 1) {
            this.getclassTable(week)
        }else if (this.index == 2) {
            this.getWeekTable()
        }else {
            this.getTeacherTable()
        }
    }

}
