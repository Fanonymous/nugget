import { Injectable } from '@angular/core';
import { HttpService } from './HttpService';
import { Observable, of, observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileObj } from '../interfaces/file-obj';
import { environment } from '../../environments/environment';
import { Utils } from './Utils';
import { Helper } from './Helper';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    public api = environment.appMedia;

    // 根据文件后缀获取文件类型
    private static getFileType(path: string): string {
        return path.substring(path.lastIndexOf('.') + 1);
    }

    constructor(
        public http: HttpService, 
        public helper: Helper,
        public file: File,
        public fileChooser: FileChooser,
        public filePath: FilePath) {
    }

    /**
     * 打开文件系统  minetype过滤
     * @param mineType 
     */
    openFile(mineType: any): Observable<String> {
        return Observable.create(observable => {
            this.fileChooser.open(mineType).then(uri => {
                this.filePath.resolveNativePath(uri).then((path: string) => {
                    observable.next(path)
                })
            })
        })
        
    }

    /**
     * 
     * @param path 将url转换成DataURL
     */
    readAsDataURL(path: string): Observable<string> {
        const paths = path.split(/\//);
        const fileName = paths[paths.length - 1];
     
        let url = path.replace(fileName, '');
     
        url = url.startsWith('file://') ? url : `file://${url}`;
     
        return Observable.create(observable => {
            this.file.readAsDataURL(url, fileName).then((result: String) => {
                observable.next(result)
            })
        })
    }

    /**
     * dataURL转换成blob对象
     * @param dataURL 
     */
    dataURLtoBlob(dataURL: string): Observable<Blob> {
        const arr = dataURL.split(',');
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
     
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
     
        const type = arr[0].match(/:(.*?);/)[1];
        return Observable.create(observable => {
            observable.next(new Blob([u8arr], { type }))
        })
    }    

    /**
     * 根据ids(文件数组)获取文件信息
     */
    getFileInfoByIds(ids: string[]): Observable<FileObj[]> {
        if (!ids || ids.length === 0) {
            return of([]);
        }
        return this.http.get(this.api + '/getByIds', {ids}, {useDefaultApi: false}).pipe(
            map(res => {
                if (!res.success) {
                    this.helper.alert(res.msg);
                    return [];
                } else {
                    for (const fileObj of res.data) {
                        fileObj.origPath = this.api + fileObj.origPath;
                        fileObj.thumbPath = this.api + fileObj.thumbPath;
                    }
                    return res.data;
                }
            })
        );
    }

    /**
     * 根据文件id获取文件信息
     */
    getFileInfoById(id: string): Observable<FileObj> {
        if (!id) {
            return of({});
        }
        return this.getFileInfoByIds([id]).pipe(
            map(res => res[0] || {})
        );
    }

    /**
     * 根据base64(字符串)批量上传图片
     * @param fileObjList 数组中的对象必须包含bse64属性
     */
    uploadMultiByBase64(fileObjList: FileObj[]): Observable<FileObj[]> {
        if (!fileObjList || fileObjList.length === 0) {
            return of([]);
        }
        return Observable.create(observer => {
            this.http.post(this.api + 'sys/oss/picUpload', fileObjList, {useDefaultApi: false}).subscribe(result => {
                if (!result.success) {
                    observer.error(false);
                } else {
                    for (const fileObj of result.data) {
                        fileObj.origPath = this.api + fileObj.origPath;
                        fileObj.thumbPath = this.api + fileObj.thumbPath;
                    }
                    observer.next(result.data);
                }
            });
        });
    }

    /**
     * 根据base64(字符串)上传单张图片
     * @param fileObj 对象必须包含origPath属性
     */
    uploadByBase64(fileObj: FileObj): Observable<FileObj> {
        if (!fileObj.base64) {
            return of({});
        }
        return this.uploadMultiByBase64([fileObj]).pipe(
            map(res => res[0] || {})
        );
    }

    /**
     *  根据filePath(文件路径)批量上传图片
     * @param fileObjList 数组中的对象必须包含origPath属性
     */
    uploadMultiByFilePath(fileObjList: FileObj[]): Observable<FileObj[]> {
        if (fileObjList.length === 0) {
            return of([]);
        }
        return Observable.create((observer) => {
            this.helper.showLoading();
            const files = [];
            for (const fileObj of fileObjList) {
                Utils.convertImgToBase64(fileObj.origPath, base64 => {
                    files.push({
                        'base64': base64,
                        'type': FileService.getFileType(fileObj.origPath),
                        'parameter': fileObj.parameter
                    });
                    if (files.length === fileObjList.length) {
                        this.uploadMultiByBase64(files).subscribe(res => {
                            observer.next(res);
                            this.helper.hideLoading();
                        });
                    }
                });
            }
        });
    }

    /**
     * 根据filePath(文件路径)上传单张图片
     * @param fileObj 对象必须包含origPath属性
     */
    uploadByFilePath(fileObj: FileObj): Observable<FileObj> {
        if (!fileObj.origPath) {
            return of({});
        }
        return this.uploadMultiByFilePath([fileObj]).pipe(
            map(res => res[0] || {})
        );
    }
    
    /**
     * base64转file对象
     */
    base64ToFile(dataurl) {
        let bytes= window.atob(dataurl.split(',')[1]);        //去掉url的头，并转换为byte  

        //处理异常,将ascii码小于0的转换为大于0  
        let ab = new ArrayBuffer(bytes.length);  
        let ia = new Uint8Array(ab);  
        for (let i = 0; i < bytes.length; i++) {  
            ia[i] = bytes.charCodeAt(i);  
        }  

        return new Blob( [ab] , {type : 'image/png'});
    }
}
