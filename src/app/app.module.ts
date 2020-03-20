//ionic angular的核心模块
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms'

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
import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { JPush } from '@jiguang-ionic/jpush/ngx';

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
        FormsModule,
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
        Base64,
        ThemeableBrowser,
        AndroidPermissions,
        QRScanner,
        MediaCapture,
        File,
        FileChooser,
        FilePath,
        WebView,
        Keyboard,
        JPush
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
