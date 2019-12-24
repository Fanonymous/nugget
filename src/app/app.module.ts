//ionic angular的核心模块
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

//引入使用模块，http
import { HttpClientModule } from '@angular/common/http';

//打包成apk的启动画面以及导航条服务
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//cordova插件
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

//引入路由配置文件和根组件
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


//开发模式引入控制台
import VConsole from 'vconsole';
var vConsole = new VConsole();

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [             //引入模块 依赖
        BrowserModule, 
        HttpClientModule, 
        IonicModule.forRoot(), 
        AppRoutingModule,
    ],
    providers: [           //配置服务
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AppVersion,
        SocialSharing,
        PhotoLibrary,
        InAppBrowser,
        Network,
        AppMinimize,
        Camera,
        ImagePicker,
        Crop,
        Base64
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
