import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, TimeoutError } from 'rxjs';
import { Logger } from '../providers/Logger';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NativeService } from '../providers/NativeService';
import { Helper } from '../providers/Helper';
import { Utils } from '../providers/Utils';
import { HttpHelper, RequestSetting } from '../providers/HttpHelper';
import { Storage } from '../providers/Storage';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService extends HttpHelper{

    constructor(public http: HttpClient,
        public helper: Helper,
        public native: NativeService) {
        super(helper);
    }

    public get(url: string, params: any = {}, setting: RequestSetting = {}) {
        const options = {
            method: 'GET',
            url: url,
            params
        };
        return this.doRequest(options, setting);
    }

    public post(url: string, body: any = {}, setting: RequestSetting = {}): Observable<any> {
        const options = {
            method: 'POST',
            url: url,
            body,
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        };
        return this.doRequest(options, setting);
    }

    public put(url: string, body: any = {}, setting: RequestSetting = {}): Observable<any> {
        const options = {
            method: 'PUT',
            url: url,
            body,
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        };
        return this.doRequest(options, setting);
    }

    public delete(url: string, params: any = {}, setting: RequestSetting = {}) {
        const options = {
            method: 'DELETE',
            url: url,
            params
        };
        return this.doRequest(options, setting);
    }

    public postFormData(url: string, params: any = {}, setting: RequestSetting = {}): Observable<any> {
        const options = {
            method: 'POST',
            url: url,
            body : params,
            // headers: new HttpHeaders({
            //     'Content-Type': '',
            // })
        };
        return this.doRequest(options, setting);
    }

    public doRequest(options, setting: RequestSetting) {
        const defaultSetting = HttpHelper.getDefaultSetting(setting);
        return defaultSetting.useDefaultApi ? this.defaultRequest(options, defaultSetting) : this.request(options, defaultSetting);
    }

    /**
    * 一个app可能有多个后台接口服务(api),针对主api添加业务处理
    */
    public defaultRequest(options, setting: RequestSetting): Observable<any> {
    //  使用默认API:APP_SERVE_URL
    if (!options.url.startsWith('http')) {
        options.url = environment.appServerUrl + options.url;
    }
    //  添加请求头
    if (Storage.localStorage.get('token')) {
        let obj : any, info : any = JSON.parse(Storage.localStorage.get('userInfo'))
        if (info) {
            obj = new HttpHeaders({
                'accesstoken' : Storage.localStorage.get('token'),
                'appType' : '5',
                'userId' : Storage.localStorage.get('userId'),
                'userType' : Storage.localStorage.get('userType') + '',
                'deptId' : Storage.localStorage.get('deptId'),
            })
        }else {
            obj = new HttpHeaders({
                'accesstoken' : Storage.localStorage.get('token')
            })
        }
        options.headers = obj;
    }
    return Observable.create(observer => {
        this.request(options, setting).subscribe(res => {
            observer.next(res); // data是主api约定返回的数据
        }, err => {
            observer.error(err);
        });
    });
    }

    public request(ops, set: RequestSetting): Observable<any> {
    const options = {
        url: '',
        method: 'POST',
        body: null,
        params: null,
        urlWithParams: false,
        headers: null,
        reportProgress: false,
        withCredentials: false,
        responseType: 'json',
        ...ops
    };
    const setting = HttpHelper.getDefaultSetting(set);
    options.url = Utils.formatUrl(options.url);
    return Observable.create(observer => {
        // 如果需要缓存，先尝试从sessionStorage中取数据
        if (setting.needCache) {
            const cacheResult = HttpHelper.getCacheData(options);
            if (cacheResult) {
                observer.next(cacheResult);
                return;
            }
        }
        this.requestBefore(options, setting);
        this.http.request(options.method, options.url, options).pipe(
            timeout(environment.requestTimeout)
        ).subscribe(res => {
            setting.needCache && HttpHelper.setCacheData(options, res); // 如果需要缓存，保存数据到sessionStorage中
            observer.next(res);
            this.requestSuccess(options);
        }, err => {
            this.requestError(options);
            observer.error(this.requestFailedHandle(options.url, err));
        });
    });
    }

    /**
    * 处理请求失败事件
    */
    private requestFailedHandle(url: string, err: HttpErrorResponse) { // : Response
    const status = err.status;
    let msg = '请求发生异常，请联系管理员';
    // 与后台约定，状态码为400即为业务异常
    if (status === 400) {
        const errData = err.error;
        //  401 token无效或过期需要重新登录
        if (errData.code === 401) {
            this.helper.message('密码已过期,请重新登录');
        } else {
            this.helper.alert('提示', errData.msg || msg);
        }
        return errData;
    }
    if (this.helper.isMobile() && !this.native.isConnecting()) {
        this.helper.alert('请连接网络');
    } else if (err instanceof TimeoutError) {
        this.helper.alert('提示', '请求超时,请稍后再试!');
    } else {
        if (status === 0) {
            msg = '服务器开小差了...';
        } else if (status === 404) {
            msg = status + ' 未找到请求地址';
        } else if (status === 500) {
            msg = status + ' 服务器开小差了...';
        }
        this.helper.alert('请求失败', msg);
        Logger.http(err, {
            url,
            status
        });
    }
    return err;
    }
}
