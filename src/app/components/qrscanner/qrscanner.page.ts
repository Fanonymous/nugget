import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Component, OnDestroy } from '@angular/core';
import { Helper } from '../../providers/Helper'
import { HttpServiceService } from '../../services/http-service.service'
import { Storage } from '../../providers/Storage'

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.page.html',
  styleUrls: ['./qrscanner.page.scss'],
})
export class QrscannerPage implements OnDestroy {

    public light: boolean = false
    public frontCamera: boolean = false
    public scannerClass: boolean
    public waitLogin: Boolean
    public isExpired: Boolean
    public isSanme: String
    public personAccount: String
    public currentDeptName: String
    public qrscannrMess: any

    constructor(
        public platform: Platform,
        public scanner: QRScanner,
        public nav: NavController,
        public helper: Helper,
        public http: HttpServiceService,
        public router: Router) {
            this.personAccount = JSON.parse(Storage.localStorage.get('userInfo')).username
            this.waitLogin = false
            this.isExpired = false
            this.isSanme = '-1'
            this.currentDeptName = ''
            this.qrscannrMess = {}
        }

    ionViewDidEnter() {
        this.scannerClass = true;
        this.waitLogin = false
        this.isExpired = false
        this.isSanme = '-1'
        this.currentDeptName = ''
        this.qrscannrMess = {}
        this.startScanner();
        this.scanner.show();
    }

    ngOnDestroy() {
        this.scannerClass = false;
        this.destroyScanner();
    }

    closeModal() {
        this.nav.back();
        this.destroyScanner();
    }

    toogleLight() {
        this.light = !this.light;
        if (this.light) {
            this.scanner.enableLight();
        }else {
            this.scanner.disableLight();
        }
    }

    toggleCamera() {
        this.frontCamera = !this.frontCamera;
        if (this.frontCamera) {
            this.scanner.useFrontCamera();
        } else {
            this.scanner.useBackCamera();
        }
    }

    startScanner() {
        let self = this
        this.platform.ready().then(() => {
            this.scanner.destroy();
            this.scanner.prepare().then((status: QRScannerStatus) => {
                if (status.authorized) {
                    let scanSub = this.scanner.scan().subscribe((text: string) => {
                        let qrData = JSON.parse(text)
                        this.qrscannrMess = qrData
                        this.scannerClass = false
                        this.waitLogin = true
                        this.destroyScanner()
                        this.scanner.hide()
                        scanSub.unsubscribe()
                        let formData : FormData = new FormData()
                        formData.append('loginCode', qrData.loginCode)

                        if (qrData.type == '1') {
                            //登录
                            this.http.post('authorization/checkLoginCode', formData).subscribe(res => {
                                if (res.code == 0) {
                                    let timer = setTimeout(() => {
                                        this.isExpired = true
                                        this.qrscannrMess = {}
                                        this.isSanme = '-1'
                                        clearTimeout(timer)
                                        timer = null
                                    }, 1000 * 60 * 2)
                                    this.isExpired = false
                                    let formdara1: FormData = new FormData()
                                    formdara1.append('mac', qrData.mac)
                                    formdara1.append('loginCode', qrData.loginCode)
                                    self.http.post('authorization/getIsAuthorization', formdara1).subscribe(data => {
                                        if (data.code == 0) {
                                            if (data.authorizationMsg.deptId == Storage.localStorage.get('deptId')) {
                                                self.isSanme = '1'
                                            }else {
                                                self.currentDeptName = data.authorizationMsg.deptName
                                                self.isSanme = '0'
                                            }
                                        }else {
                                            self.helper.message('服务器开小差了...')
                                        }
                                    })
                                }else {
                                    this.isExpired = true
                                }
                            }) 
                        }else {
                            //绑定
                            this.http.post('authorization/checkLoginCode', formData).subscribe(res1 => {
                                if (res1.code == 0) {
                                    this.router.navigate(['/qrscanner-bind'], {
                                        queryParams: {
                                            scannerMess: text
                                        }
                                    })
                                }else {
                                    this.isExpired = true
                                }
                            })                           
                        }
                    })
                }else if (status.denied) {
                    this.helper.alert('没有权限', '没有摄像头权限，请前往设置中开启', () => {
                        this.scanner.openSettings();
                    })
                }else {
                    this.helper.alert('没有权限', '没有摄像头权限，请前往设置中开启', () => {
                        this.scanner.openSettings();
                    })
                }
            }).catch((e: any) => console.log('二维码插件调用失败：', e));
        });
    }

    reScanner() {
        this.waitLogin = false
        this.scannerClass = true
        this.startScanner()
        this.scanner.show()
    }

    destroyScanner() {
        this.scanner.destroy();
        let timer = setTimeout(() => {
            (window.document.querySelector('html') as HTMLElement).style.backgroundColor = '#fff';
            clearTimeout(timer)
            timer = null
        }, 500)
    }

    handleCancel() {
        let formdata: FormData = new FormData()
        formdata.append('loginCode', this.qrscannrMess.loginCode)
        this.http.post('authorization/changeLoginCodeStatus', formdata).subscribe(res => {
            if (res.code == 0) {
                this.nav.back()
            }else {
                this.helper.message(res.msg)
            }
        })
    }

    confirmLogin() {
        let formdata: FormData = new FormData()
        formdata.append('userId', Storage.localStorage.get('userId'))
        formdata.append('userType', Storage.localStorage.get('userType'))
        formdata.append('loginCode', this.qrscannrMess.loginCode)
        this.http.post('authorization/confirmLogin', formdata).subscribe(res => {
            if (res.code == 0) {
                this.nav.back()
            }else {
                this.helper.message(res.msg)
            }
        })
    }
}