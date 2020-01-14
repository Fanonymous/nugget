import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { HttpServiceService } from '../../../services/http-service.service'
import { Storage } from '../../../providers/Storage'

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
    public index: Number
    public gradeList: Array<any>
    public gradeObj: any = {}
    public classList: Array<any>
    public classObj: any = {}

    public gradeValue: any
    public gradeName: String
    public classValue: any
    public className: String

    public subjectId: any
    public subjectName: String
    public teacherId: any
    public teacherName: String
    public subjectList: Array<any>
    public subjectObj: any = {}
    public teacherList: Array<any>
    public teacherObj: any = {}

    constructor(
        public navParams: NavParams,
        public http: HttpServiceService) {
        this.index = this.navParams.data.type
        this.gradeList = []
        this.classList = []
    }

    ngOnInit() {
        if (this.index == 2) {
            this.getgradeList()
        }else {
            this.getSubjectList()
        }
    }

    getgradeList() {
        this.http.get('common/queryGradeList').subscribe(res => {
            if (res.code == 0) {
                this.gradeList = res.list || []
                this.gradeObj = {}
                this.gradeList.forEach(item => {
                    this.gradeObj[item.gradeId] = item.gradeName
                })
            }
        })
    }

    getclassList() {
        this.http.get('common/queryClassList', {
            gradeId: this.gradeValue
        }).subscribe(res => {
            if (res.code == 0) {
                this.classList = res.list || []
                this.classObj = {}
                this.classList.forEach(item => {
                    this.classObj[item.classId] = item.className
                })
            }
        })
    }

    handleSelect() {
        this.gradeName = this.gradeObj[this.gradeValue]
        this.getclassList()
    }

    classChange() {
        this.className = this.classObj[this.classValue]
    }

    confirmFilter() {
        this.navParams.data.modal.dismiss({
            gradeId: this.gradeValue,
            gradeName: this.gradeName,
            classId: this.classValue,
            className: this.className,
            subjectId: this.subjectId,
            subjectName: this.subjectName,
            teacherId: this.teacherId,
            teacherName: this.teacherName
        })
    }

    reset() {
        this.gradeValue = ''
        this.gradeName = ''
        this.classValue = ''
        this.className = ''
    }

    getSubjectList() {
        this.http.post('eduManageSubject/list', {
            schoolId: Storage.localStorage.get('deptId'),
            page: 1,
            limit: 999
        }).subscribe(res => {
            if (res.code == 0) {
                this.subjectList = res.page.list || []
                this.subjectObj = {}
                this.subjectList.forEach(item => {
                    this.subjectObj[item.subjectId] = item.subjectName
                })
            }
        })
    }

    subjectChange() {
        this.subjectName = this.subjectObj[this.subjectId]
        this.getTeacherList()
    }

    getTeacherList() {
        this.http.get('eduManageTeachingSubject/teacherListBySubject', {
            schoolId: Storage.localStorage.get('deptId'),
            subjectId: this.subjectId
        }).subscribe(res => {
            if (res.code == 0) {
                this.teacherList = res.list || []
                this.teacherObj = {}
                this.teacherList.forEach(item => {
                    this.teacherObj[item.teacherId] = item.teacherName
                })
            }
        })
    }

    teacherChange() {
        this.teacherName = this.teacherObj[this.teacherId]
    }

}
