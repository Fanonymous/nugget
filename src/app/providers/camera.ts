import { Injectable } from '@angular/core';
import { Observable, TimeoutError } from 'rxjs';
import { Helper } from './Helper'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx'
import { Base64 } from '@ionic-native/base64/ngx';

/**
 * 工具类：相机和相册操作
 */
@Injectable({
    providedIn: 'root'
})

export class camera {
    constructor(
        private camera : Camera, 
        private helper : Helper,
        private ImagePicker : ImagePicker,
        private base64 : Base64) {}
    /**
   * 根据图片路径把图片转化为base64字符串
   * @param path 图片路径，可以是file://  或 http://   或 相对路径
   * @param width 转换后的图片宽度，默认为原图宽度
   * @param height 转换后的图片高度，默认为原图高度
   * @param outputFormat 一般为 'image/jpeg' 'image/png'
   */
    convertImgToBase64(path: string, width = null, height = null, outputFormat = 'image/jpeg'): Observable<string> {
        return Observable.create(observer => {
            this.base64.encodeFile(path).then((base64File: string) => {
                observer.next(base64File);
            }, (err) => {
                console.log(err);
            })
        });
    }

  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
    getPicture(options: CameraOptions = {}): Observable<string> {
        const ops: CameraOptions = {
            sourceType: this.camera.PictureSourceType.CAMERA, // 图片来源,CAMERA:1,拍照,PHOTOLIBRARY:2,相册
            destinationType: this.camera.DestinationType.FILE_URI, // 默认返回图片路径：DATA_URL:0,base64字符串，FILE_URI:1,图片路径
            quality: 100, // 图像质量，范围为0 - 100
            allowEdit: false, // 选择图片前是否允许编辑
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 1024, // 缩放图像的宽度（像素）
            targetHeight: 1024, // 缩放图像的高度（像素）
            saveToPhotoAlbum: false, // 是否保存到相册
            correctOrientation: true, ...options
        };
        return Observable.create(observer => {
            this.camera.getPicture(ops).then((imgData: string) => {
                if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
                    observer.next('data:image/jpg;base64,' + imgData);
                } else {
                    observer.next(imgData);
                }
            }).catch(err => {
                if (err == 20) {
                    this.helper.message('没有权限,请在应用管理中开启权限');
                } else if (String(err).indexOf('cancel') != -1) {
                   
                } else {
                    
                }
                observer.error(false);
            });
        });
    }

    /**
     * 通过图库选择多图
     * @param options
     */
    getMultiplePicture(options: CameraOptions | any = {}): Observable<any> {
        const that = this;
        const ops = {
            destinationType: options.destinationType || 0,
            maximumImagesCount: options.maximumImagesCount || 1,
            width: options.width || 1024, // 缩放图像的宽度（像素）
            height: options.height || 1024, // 缩放图像的高度（像素）
            quality: options.quality || 100,
             ...options
        };
        return Observable.create(observer => {
            this.ImagePicker.getPictures(ops).then(files => {
                if (options.destinationType && options.destinationType === 1) { // 0:base64字符串,1:图片url
                    observer.next(files);
                }else {
                    const imgBase64s = []; // base64字符串数组
                    for (const fileUrl of files) {
                        that.convertImgToBase64(fileUrl).subscribe(base64 => {
                            imgBase64s.push(base64);
                            if (imgBase64s.length === files.length) {
                                observer.next(imgBase64s);
                            }
                        });
                    }
                }
            }).catch(err => {
                observer.error(false);
            });
        });
    }
}