import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { camera } from '../../../../providers/camera'
import { HttpServiceService } from '../../../../services/http-service.service'
import { HttpNoreturnService } from '../../../../services/http-noreturn.service'
import { NativeService } from '../../../../providers/NativeService'
import { FileService } from '../../../../providers/FileService'
import { Helper } from '../../../../providers/Helper'
import { environment } from '../../../../../environments/environment';
import { Observable, observable, forkJoin, of, from } from 'rxjs';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-punch',
  templateUrl: './edit-punch.page.html',
  styleUrls: ['./edit-punch.page.scss'],
})
export class EditPunchPage implements OnInit {
    public baseApi: String = environment.fileServerUrl
    public punchModel: any;
    public classList: any;
    public classObj: any;
    public imgages: any;
    public videUrl: any;
    public videoFullpath: any;
    public audioUrl: any;
    public audioFullpath: any;
    public infoId: String
    public tempImgUrl: Array<String>
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpServiceService,
        public https: HttpNoreturnService,
        public actionSheetController: ActionSheetController,
        public camera: camera,
        public nativeService: NativeService,
        public fileService: FileService,
        public base64: Base64,
        public helper: Helper,
        public filePath: FilePath,
        public webView: WebView,
        public httpClient: HttpClient
    ) { 
        this.punchModel = {
            themeName: '',
            detail: '',
            image: '',
            video: '',
            voice: '',
            gradeId: '',
            classId: '',
            stopDate: '',

        }
        this.classList = []
        this.classObj = {}
        this.imgages = []
        this.videUrl = ''
        this.videoFullpath = ''
        this.audioUrl = ''
        this.audioFullpath = ''
        this.infoId = ''
        this.tempImgUrl = []
    }

    getClassList() {
        this.http.get('WechatAppletTeaching/headmasterClassList').subscribe(res => {
            if (res.code == 0) {
                this.classList = res.list || []
                this.classObj = {}
                if (this.classList.length) {
                    res.list.forEach(item => {
                        this.classObj[item.classId] = item
                    })
                }
            }
        })
    }

    handleSelect() {
        this.punchModel.gradeId = this.classObj[this.punchModel.classId].gradeId
    }

    async addPicture() {
        const self = this
        const actionSheet = await this.actionSheetController.create({
            cssClass  : 'choise--album',
            buttons: [
                {
                    text: '相册选择',
                    handler: () => {
                        self.camera.getMultiplePicture({
                            maximumImagesCount: 9,
                            destinationType: 1
                        }).subscribe(imgUrls => {
                            this.transformBase64(imgUrls)
                        });
                    }
                },
                {
                    text: '拍照',
                    handler: () => {
                        self.camera.getPicture({ destinationType : 1 }).subscribe(img => {
                            if (this.imgages.length < 9) {
                                this.camera.convertImgToBase64(img).subscribe(path => {
                                    this.imgages.push(path)
                                })
                            }else {
                                this.helper.message('最多添加9张图片')
                            }
                        })
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        })
        await actionSheet.present()
    }

    async addVideo() {
        const self = this
        const actionSheet = await this.actionSheetController.create({
            cssClass  : 'choise--album',
            buttons: [
                {
                    text: '相册选择',
                    handler: () => {
                        self.camera.getPicture({ sourceType: 0, destinationType: 1, mediaType : 1 }).subscribe(video => {
                            this.videoFullpath = `file://${video}`
                            this.videUrl = this.webView.convertFileSrc(`file://${video}`)
                        })
                    }
                },
                {
                    text: '录制视频',
                    handler: () => {
                        self.nativeService.getVideoMedia().subscribe((videoMedia:any) => {
                            this.videoFullpath = videoMedia[0].fullPath
                            this.videUrl = this.webView.convertFileSrc(videoMedia[0].fullPath)
                        })
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        })
        await actionSheet.present()
    }

    async addAudio() {
        const self = this
        const actionSheet = await this.actionSheetController.create({
            cssClass  : 'choise--album',
            buttons: [
                {
                    text: '相册选择',
                    handler: () => {
                        this.fileService.openFile({"mime": "audio/amr"}).subscribe(url => {
                            this.audioFullpath = url
                            let obj: any = { url: url }
                            this.audioUrl = this.webView.convertFileSrc(obj.url)
                        })
                    }
                },
                {
                    text: '录制音频',
                    handler: () => {
                        self.nativeService.getAudioMedia().subscribe((videoMedia: any) => {
                            this.audioFullpath = videoMedia.fullPath
                            this.audioUrl = this.webView.convertFileSrc(videoMedia.fullPath)
                        })
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        })
        await actionSheet.present()
    }

    base64ToFormdata(base64Arr) {
        let arr = []
        base64Arr.forEach(item => {
            if (item.indexOf('fileName=') > 0) {
                this.tempImgUrl.push(item.split('fileName=')[1])
            }else {
                this.fileService.dataURLtoBlob(item).subscribe(blob => {
                    let formData : FormData = new FormData()
                    formData.append('file', blob)
                    formData.append('type', `.${item.split(';')[0].split('/')[1]}`)
                    arr.push(formData)
                })
            }
        });
        return arr
    }

    uploadFile(file): Observable<String> {
        return Observable.create(ob => {
            this.fileService.readAsDataURL(file).subscribe(res => {
                this.fileService.dataURLtoBlob(res).subscribe(blob => {
                    let formData : FormData = new FormData()
                    formData.append('file', blob)
                    formData.append('type', `.${file.split('.')[1]}`)
                    ob.next(formData)
                })
            })
        })
    }

    transformBase64(base64s) {
        for (let i = 0; i < base64s.length; i ++) {
            if (this.imgages.length < 9) {
                this.camera.convertImgToBase64(base64s[i]).subscribe(res => {
                    this.imgages.push(res)
                })
            }else {
                break;
            }
        }
    }
    

    handleCreat() {
        this.tempImgUrl = []
        if (this.videUrl && this.audioUrl) {
            //转换成formdata对象
            if (this.videUrl.indexOf('fileName=') > 0) {
                this.punchModel.video = this.videUrl.split('fileName=')[1]
                if (this.audioUrl.indexOf('fileName=') > 0) {
                    this.punchModel.audio = this.audioUrl.split('fileName=')[1]
                    if (this.imgages.length) {
                        if (this.base64ToFormdata(this.imgages).length == 0) {
                            this.punchModel.image = this.tempImgUrl.join(',')
                            this.submitData()
                        }else {
                            forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                                let imgs = []
                                imgUrls.forEach((url: any) => {
                                    imgs.push(url.url)
                                })
                                imgs = imgs.concat(this.tempImgUrl)
                                this.punchModel.image = imgs.join(',')
                                this.submitData()
                            }, err => {
                                this.helper.message(`照片上传失败${err}`)
                            })
                        }                      
                    }else {
                        this.submitData()
                    }
                }else {
                    this.uploadFile(this.audioUrl).subscribe(audio1 => {
                        this.http.postFormData('sys/oss/upload', audio1).subscribe(audioUrl => {
                            if (audioUrl.code == 0) {
                                this.punchModel.audio = audioUrl.url
                                if (this.imgages.length) {

                                    if (this.base64ToFormdata(this.imgages).length == 0) {
                                        this.punchModel.image = this.tempImgUrl.join(',')
                                        this.submitData()
                                    }else {
                                        forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                                            let imgs = []
                                            imgUrls.forEach((url: any) => {
                                                imgs.push(url.url)
                                            })
                                            imgs = imgs.concat(this.tempImgUrl)
                                            this.punchModel.image = imgs.join(',')
                                            this.submitData()
                                        }, err => {
                                            this.helper.message(`照片上传失败${err}`)
                                        })
                                    }
                                }else {
                                    this.submitData()
                                }
                            }else {
                                this.helper.message('音频上传失败！')
                            }
                        })
                    })
                }
            }else{
                this.uploadFile(this.videUrl).subscribe(video1 => {
                    this.http.postFormData('sys/oss/viedoUpload', video1).subscribe(videoUrl => {
                        if (videoUrl.code == 0) {
                            this.punchModel.video = videoUrl.url
                            if (this.audioUrl.indexOf('fileName=') > 0) {
                                this.punchModel.audio = this.audioUrl.split('fileName=')[1]
                                if (this.imgages.length) {
                                    if (this.base64ToFormdata(this.imgages).length == 0) {
                                        this.punchModel.image = this.tempImgUrl.join(',')
                                        this.submitData()
                                    }else {
                                        forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                                            let imgs = []
                                            imgUrls.forEach((url: any) => {
                                                imgs.push(url.url)
                                            })
                                            imgs = imgs.concat(this.tempImgUrl)
                                            this.punchModel.image = imgs.join(',')
                                            this.submitData()
                                        }, err => {
                                            this.helper.message(`照片上传失败${err}`)
                                        })
                                    }
                                }else {
                                    this.submitData()
                                }
                            }else {
                                this.uploadFile(this.audioUrl).subscribe(audio1 => {
                                    this.http.postFormData('sys/oss/upload', audio1).subscribe(audioUrl => {
                                        if (audioUrl.code == 0) {
                                            this.punchModel.audio = audioUrl.url
                                            if (this.imgages.length) {
                                                if (this.base64ToFormdata(this.imgages).length == 0) {
                                                    this.punchModel.image = this.tempImgUrl.join(',')
                                                    this.submitData()
                                                }else {
                                                    forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                                                        let imgs = []
                                                        imgUrls.forEach((url: any) => {
                                                            imgs.push(url.url)
                                                        })
                                                        imgs = imgs.concat(this.tempImgUrl)
                                                        this.punchModel.image = imgs.join(',')
                                                        this.submitData()
                                                    }, err => {
                                                        this.helper.message(`照片上传失败${err}`)
                                                    })
                                                }
                                            }else {
                                                this.submitData()
                                            }
                                        }else {
                                            this.helper.message('音频上传失败！')
                                        }
                                    })
                                })
                            }
                        }else {
                            this.helper.message('视频上传失败！')
                        }
                    })
                })
            }
            
            
        }else if (this.videUrl && !this.audioUrl) {
            //视频存在，音频不存在
            if (this.videUrl.indexOf('fileName=') > 0) {
                this.punchModel.video = this.videUrl.split('fileName=')[1]
                if (this.imgages.length) {
                    if (this.base64ToFormdata(this.imgages).length == 0) {
                        this.punchModel.image = this.tempImgUrl.join(',')
                        this.submitData()
                    }else {
                        forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                            let imgs = []
                            imgUrls.forEach((url: any) => {
                                imgs.push(url.url)
                            })
                            imgs = imgs.concat(this.tempImgUrl)
                            this.punchModel.image = imgs.join(',')
                            this.submitData()
                        }, err => {
                            this.helper.message(`照片上传失败${err}`)
                        })
                    }
                }else {
                    this.submitData()
                }
            }else {
                this.uploadFile(this.videUrl).subscribe(video2 => {
                    this.http.postFormData('sys/oss/viedoUpload', video2).subscribe(videoUrl1 => {
                        if (videoUrl1.code == 0) {
                            this.punchModel.video = videoUrl1.url
                            if (this.imgages.length) {
                                if (this.base64ToFormdata(this.imgages).length == 0) {
                                    this.punchModel.image = this.tempImgUrl.join(',')
                                    this.submitData()
                                }else {
                                    forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                                        let imgs = []
                                        imgUrls.forEach((url: any) => {
                                            imgs.push(url.url)
                                        })
                                        imgs = imgs.concat(this.tempImgUrl)
                                        this.punchModel.image = imgs.join(',')
                                        this.submitData()
                                    }, err => {
                                        this.helper.message(`照片上传失败${err}`)
                                    })
                                }
                            }else {
                                this.submitData()
                            }
                        }else {
                            this.helper.message('视频上传失败！')
                        }
                    })
                })
            }
            
            
        }else if (!this.videUrl && this.audioUrl) {
            //音频存在，视频不存在
            if (this.audioUrl.indexOf('fileName=') > 0) {
                this.punchModel.audio = this.audioUrl.split('fileName=')[1]
                if (this.imgages.length) {
                    if (this.base64ToFormdata(this.imgages).length == 0) {
                        this.punchModel.image = this.tempImgUrl.join(',')
                        this.submitData()
                    }else {
                        forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                            let imgs = []
                            imgUrls.forEach((url: any) => {
                                imgs.push(url.url)
                            })
                            imgs = imgs.concat(this.tempImgUrl)
                            this.punchModel.image = imgs.join(',')
                            this.submitData()
                        }, err => {
                            this.helper.message(`照片上传失败${err}`)
                        })
                    }
                }else {
                    this.submitData()
                }
            }else {
                this.uploadFile(this.audioUrl).subscribe(video2 => {
                    this.http.postFormData('sys/oss/viedoUpload', video2).subscribe(videoUrl1 => {
                        if (videoUrl1.code == 0) {
                            this.punchModel.audio = videoUrl1.url
                            if (this.imgages.length) {
                                if (this.base64ToFormdata(this.imgages).length == 0) {
                                    this.punchModel.image = this.tempImgUrl.join(',')
                                    this.submitData()
                                }else {
                                    forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                                        let imgs = []
                                        imgUrls.forEach((url: any) => {
                                            imgs.push(url.url)
                                        })
                                        imgs = imgs.concat(this.tempImgUrl)
                                        this.punchModel.image = imgs.join(',')
                                        this.submitData()
                                    }, err => {
                                        this.helper.message(`照片上传失败${err}`)
                                    })
                                }
                            }else {
                                this.submitData()
                            }
                        }else {
                            this.helper.message('视频上传失败！')
                        }
                    })
                })
            }
            
        }else {
            //只有图片
            if (this.imgages.length) {
                if (this.base64ToFormdata(this.imgages).length == 0) {
                    this.punchModel.image = this.tempImgUrl.join(',')
                    this.submitData()
                }else {
                    forkJoin(this.getHttpForm(this.base64ToFormdata(this.imgages))).subscribe(imgUrls => {
                        let imgs = []
                        imgUrls.forEach((url: any) => {
                            imgs.push(url.url)
                        })
                        imgs = imgs.concat(this.tempImgUrl)
                        this.punchModel.image = imgs.join(',')
                        this.submitData()
                    }, err => {
                        this.helper.message(`照片上传失败${err}`)
                    })
                }
            }else {
                this.submitData()
            }
        }
    }

    submitData() {
        let endTime = '', date = new Date()
        if (this.punchModel.stopDate) {
            endTime = `${this.punchModel.stopDate.split('T')[0]} 23:59:59`
        }else {
            endTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 23:59:59`
        }
        this.http.post('clockIn/update', {
            infoId: this.infoId,
            themeName: this.punchModel.themeName,
            detailInfo: this.punchModel.detail,
            endDate: endTime,
            pictureAddress: this.punchModel.image,
            videoAddress: this.punchModel.video,
            audioAddress: this.punchModel.audio,
        }).subscribe(res => {
            if (res.code == 0) {
                this.router.navigate(['/check-in/view-detail'],{
                    queryParams: {
                        id: this.infoId
                    }
                })
            }
        })
    }

    getHttpForm(formdatas) {
        let arr = []
        formdatas.forEach(item => {
            let options = {
                headers: this.https.getHeader(),
                body : item
            }
            arr.push(this.httpClient.request('POST',`${environment.appServerUrl}sys/oss/picUpload`, options))
        });
        return arr
    }

    deleteImage(i) {
        this.imgages.splice(i, 1)
    }

    deleteVideo() {
        this.videUrl = ''
        this.videoFullpath = ''
    }

    deleteAudio() {
        this.audioUrl = ''
        this.audioFullpath = ''
    }

    getDetailById() {
        this.http.post('clockIn/queryInfo', {
            infoId: this.infoId,
            exerciseState: 0
        }).subscribe(res => {
            if (res.code == 0) {
                let obj = res.list[0]
                this.punchModel.themeName = obj.themeName
                this.punchModel.detail = obj.detailInfo
                this.punchModel.gradeId = obj.gradeId
                this.punchModel.classId = obj.classId
                this.punchModel.stopDate = obj.endDate
                obj.videoAddress && (this.videUrl = this.baseApi + obj.videoAddress)
                obj.audioAddress && (this.audioUrl = this.baseApi + obj.audioAddress)
                let arr = []
                if (obj.pictureAddress) {
                    let _pic = obj.pictureAddress.split(',')
                    _pic.forEach(item => {
                        arr.push(this.baseApi + item)
                    })
                    this.imgages = arr
                }
            }
        })
    }

    ngOnInit() {
        this.getClassList()
        this.route.queryParams.subscribe(res => {
            this.infoId = res.id
            this.getDetailById()
        })
    }

}
