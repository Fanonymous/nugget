import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../.../../../services/http-service.service'
import { Storage } from '../../providers/Storage'
import { Router, ActivatedRoute } from '@angular/router'
import { Helper } from '../../providers/Helper'
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-qrscanner-bind',
  templateUrl: './qrscanner-bind.page.html',
  styleUrls: ['./qrscanner-bind.page.scss'],
})
export class QrscannerBindPage implements OnInit {
    public isSuccess: Boolean = false
    public model: any = {
        deptId: '',
        deptType: '',
        deptName: '',
        classroomId: '',
        classroomName: '',
        className: '',
        deviceId: '',
        deviceName: '',
        tagId: '',
        tagName: '',
        userName: ''
    }
    public scannrMess: any
    public schoolList: any
    public schoolObj: any
    public classList: any
    public classObj: any
    public deviceList: any
    public deviceObj: any
    public brandList: any
    public brandObj: any

    constructor(
        public http: HttpServiceService,
        public route: ActivatedRoute,
        public helper: Helper,
        public nav: NavController,
        public router : Router) { }

    ngOnInit() {
        this.model.deptId = Storage.localStorage.get('deptId')
        this.model.deptType = Storage.localStorage.get('deptType')
        this.model.deptName = Storage.localStorage.get('deptName')
        this.model.userName = Storage.localStorage.get('userName')
        this.route.queryParams.subscribe(res => {
            this.scannrMess = JSON.parse(res.scannerMess)
            this.getSchoolList()
            this.getClass()
            this.getType()
            this.getBrand()
        })
    }

    getSchoolList() {
        this.http.post('authorization/getSchoolList', {
            userId: Storage.localStorage.get('userId'),
            userType: Storage.localStorage.get('userType'),
            deptId: this.model.deptId,
            terminalType: this.scannrMess.terminalType
        }).subscribe(res => {
            if (res.code == 0) {
                this.schoolList = res.list || []
                this.schoolObj = {}
                this.schoolList.forEach(item => {
                    this.schoolObj[item.deptId] = item
                })
            }
        })
    }

    getClass() {
        this.http.post('authorization/getClassroomList', {
            deptId: this.model.deptId,
            equipMac: this.scannrMess.mac
        }).subscribe(res => {
            if (res.code == 0) {
                this.classList = res.list
                this.classObj = {}
                this.classList.forEach(item => {
                    this.classObj[item.classroomId] = item
                })
            }
        })
    }

    getType() {
        this.http.post('authorization/getDevice', {
            userId: Storage.localStorage.get('userId'),
            userType: Storage.localStorage.get('userType'),
            deptId: this.model.deptId,
        }).subscribe(res => {
            if (res.code == 0) {
                this.deviceList = res.list || []
                this.deviceObj = {}
                this.deviceList.forEach(item => {
                    item.deviceId = item.deviceId + ''
                    this.deviceObj[item.deviceId] = item
                })
            }
        })
    }

    getBrand() {
        this.http.post('authorization/getUseAndBrand', {
            userType: Storage.localStorage.get('userType'),
            deptId: this.model.deptId,
            type : 2
        }).subscribe(res => {
            if (res.code == 0) {
                this.brandList = res.list || []
                this.brandObj = {}
                this.brandList.forEach(item => {
                    this.brandObj[item.tagId] = item
                })
            }
        })
    }

    handleChange() {
        this.getClass()
        this.getType()
        this.getBrand()
        this.model.deptType = this.schoolObj[this.model.deptId].deptType
        this.model.deptName = this.schoolObj[this.model.deptId].deptName
        this.model.classroomId = ''
        this.model.classroomName = ''
        this.model.deviceId = ''
        this.model.deviceName = ''
        this.model.tagId = ''
        this.model.tagName = ''
    }

    handleClassChange() {
        this.model.classroomName = this.classObj[this.model.classroomId].classroomName
        this.model.className = this.classObj[this.model.classroomId].gradeName + this.classObj[this.model.classroomId].className
    }

    handleTypeChange() {
        this.model.deviceName = this.deviceObj[this.model.deviceId].deviceName
    }

    handleTagChange() {
        this.model.tagName = this.brandObj[this.model.tagId].tagValue
    }

    handleBind() {
        if (this.classObj[this.model.classroomId].isBind == 1) {
            this.helper.alert('温馨提示', `<span class="class-room--name">${this.model.classroomName}</span>已有绑定设备，是否重新绑定？`, () => {
                this.confirmBind()
            }, () => {}, 'confirm--bind')
        }else {
            this.confirmBind()
        }
    }

    confirmBind() {
        this.http.post('authorization/saveAuthorizationMsg', {
            loginCode: this.scannrMess.loginCode,
            mac: this.scannrMess.mac,
            userId: Storage.localStorage.get('userId'),
            deptId: this.model.deptId,
            deptType: this.model.deptType,
            deptName: this.model.deptName,
            classroomId: this.model.classroomId,
            classroomName: this.model.classroomName,
            deviceId: this.model.deviceId,
            deviceName: this.model.deviceName,
            tagId: this.model.tagId,
            tagName: this.model.tagName,
            userName: this.model.userName
        }).subscribe(res => {
            if (res.code == 0) {
                this.isSuccess = true
            }
        })
    }

    changeBind() {
        this.isSuccess = false
    }

}
