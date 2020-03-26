import { Injectable, Component } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Storage } from './Storage'
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class JPushService {
    public sequence: number
    constructor(
        private platform: Platform,
        private jPush: JPush,
        public router: Router
    ) {
        this.sequence = 0
    }

    initJpush() {
        if (!this.platform.is('mobile')) {
            return;
        }
        this.jPush.init();
        this.jPush.setDebugMode(true);
        this.jPushAddEventListener();
        this.setTags(['nugget']);
        this.setAlias(Storage.localStorage.get('userId'))
    }

    public jPushAddEventListener() {
        try {
            // 判断系统设置中是否允许当前应用推送
            this.jPush.getUserNotificationSettings().then(result => {
                if (result == 0) {
                    console.log('系统设置中已关闭应用推送');
                } else if (result > 0) {
                    console.log('系统设置中打开了应用推送');
                }
            });
        }catch (error) {
            console.log(error);
        }

        //注册极光
        document.addEventListener('jpush.receiveRegistrationId', (event: any) => {
            console.log("nugget当前：" + JSON.stringify(event));
            Storage.localStorage.set('registrationId', event.registrationId)
        }, false)


        //点击通知进入应用程序时会触发的事件
        document.addEventListener("jpush.openNotification", event => {
            let content = this.platform.is('ios') ? event['aps'].alert : event['alert'];
            console.log("黄 点击通知事件" + JSON.stringify(event));
            if (Storage.localStorage.get('userType') == 3) {
                this.router.navigate(['/student-punch'])
            }else {
                this.router.navigate(['/check-in'])
            }
        }, false);

        //收到通知时会触发该事件
        document.addEventListener("jpush.receiveNotification", event => {
            let content = this.platform.is('ios') ? event['aps'].alert : event['alert'];
            console.log("黄 收到通知事件 " + JSON.stringify(event));
        }, false);

        //收到自定义消息时触发这个事件
        document.addEventListener("jpush.receiveMessage", event => {
            let message = this.platform.is('ios') ? event['content'] : event['message'];
            alert("黄 收到自定义通知事件" + JSON.stringify(event));
        }, false);


        //设置标签/别名回调函数
        document.addEventListener("jpush.setTagsWithAlias", event => {
            let result = "result code:" + event['resultCode'] + " ";
            result += "tags:" + event['tags'] + " ";
            result += "alias:" + event['alias'] + " ";
        }, false);

    }

    setTags(items: string[]) {
        this.jPush.setTags({ sequence: this.sequence++, tags: items }).then(this.tagResultHandler)
        .catch(this.errorHandler);
    }

    errorHandler(err) {
        var sequence: number = err.sequence;
        if(sequence==undefined){
        sequence=0;
        }
        var code = err.code;
        if(code==undefined){
            code=0;
        }
        console.error("Error!" + "\nSequence: " + sequence + "\nCode: " + code);
    };
  

    tagResultHandler(result) {
        var sequence: number = result.sequence;
        var tags: Array<string> = result.tags == null ? [] : result.tags;
        console.info(tags);
        console.info("Success!" + "\nSequence: " + sequence + "\nTags: " + tags.toString());
    };
  

  //设置别名,一个用户只有一个别名
    public setAlias(userId) {
        try {
            if (!this.platform.is('mobile')) {
                return;
            }
            //ios设置setAlias有bug,值必须为string类型,不能是number类型
            this.jPush.setAlias({
                sequence: 0,
                alias: userId + ""
            });
        } catch (error) {
            console.log(error);
        }

    }
}