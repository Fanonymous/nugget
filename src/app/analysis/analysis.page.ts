import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import F2 from '@antv/f2';

import { Storage } from '../providers/Storage'
import { HttpServiceService } from '../services/http-service.service'
import { Helper } from '../providers/Helper'
import { Utils } from '../providers/Utils'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
})
export class AnalysisPage implements OnInit {
    @ViewChild('mediaUse', { static: false }) mediaUse : ElementRef
    @ViewChild('mediaUseTeacher', { static : false }) mediaUseTeacher : ElementRef

    public baseApi : any = environment.fileServerUrl
    public isHasMedia : Boolean = true
    public img : String = '../../assets/img/avaclass.png'
    public schoolBottomObj : any = {name : '', total : ''}
    public percentage : Number = 0
    public level : String = ''

    public isHasMediaTeacher : Boolean = true
    public img1 : String = '../../assets/img/avatar.png'
    public teacherBottomObj : any = {full_name : '', rank : '', rate : '', total : ''}
    public level1 : String = ''

    public img2 : String = '../../assets/img/avaclass.png'
    public educationObj : any = { img : '', name : '', val : 0}
    public netObj : any = { bytesReceived : 0, bytesSent : 0, bytesTotal : 0, net : 1, standardRate : 0, standardNum : '', noStandardNum : '', totalNum : '', student : 0, teacher : 0}

    public userType : String
    public menuIds : String = '10001'
    public levelArr : Array<String> = ["差", "较差", "良", "优秀", "优异", "最牛"]

    constructor(
        public http : HttpServiceService,
        public helper : Helper) { }

    ionViewWillEnter() {
        let menu : any = JSON.parse(Storage.localStorage.get('menuList')), userInfo : any = JSON.parse(Storage.localStorage.get('userInfo'))
        this.userType = userInfo.userType
        menu[0] && (this.menuIds = menu[0].menuIds)
        if (this.menuIds.indexOf('10002') > -1) {
            this.isHasMedia = true
            this.http.get('WechatAppletAnalysis/sInformationLiteracyRank', {
                startDate : Utils.dateFormat(new Date(new Date().getTime() - 86400000 * 7), 'yyyy-MM-dd'),
                endDate  : Utils.dateFormat(new Date(), 'yyyy-MM-dd')
            }).subscribe(res => {
                if (res.code == 0) {
                    this.getSmallPieOption(this.mediaUse.nativeElement, 150, 150, '我的学校', res.average && res.average.average ? res.average.average : 0)
                    res.list[0].backgroundPicture && (this.img = this.baseApi + res.list[0].backgroundPicture)
                    this.schoolBottomObj = res.list[0]
                    this.percentage = res.average.scale
                    this.level = res.page.xValue[parseInt(res.average.rate) - 1]
                }else {
                    this.helper.message(res.msg)
                }
            })
        }else {
            this.isHasMedia = false
        }


        if (this.menuIds.indexOf('10003') > -1) {
            this.isHasMediaTeacher = true
            this.getMediaTeacher()
        }else {
            this.isHasMediaTeacher = false
        }

        if (this.menuIds.indexOf('10004') > -1) {
            this.getEducationData()
        }
        
    }

    getMediaTeacher() {
        this.http.get('WechatAppletAnalysis/tInformationLiteracyRank', {
            startDate : Utils.dateFormat(new Date(new Date().getTime() - 86400000 * 7), 'yyyy-MM-dd'),
            endDate  : Utils.dateFormat(new Date(), 'yyyy-MM-dd')
        }).subscribe(res => {
            if (res.code == 0) {
                this.getSmallPieOption(this.mediaUseTeacher.nativeElement, 150, 150, '我的课堂', res.list[0].total)
                res.list[0].background_picture && (this.img1 = this.baseApi + res.list[0].background_picture)
                this.teacherBottomObj = res.list[0]
                this.level1 = this.levelArr[parseInt(res.list[0].rate) - 1]
            }else {
                this.helper.message(res.msg)
            }
        })
    }

    getEducationData() {
        this.http.get('WechatAppletAnalysis/equipBootLength', {page : 1, limit: 20}).subscribe(res => {
            if (res.code == 0) {
                res.page.list[0] && (this.educationObj = res.page.list[0])
                this.educationObj.img && (this.img2 = this.baseApi + this.educationObj.img)
            }else {
                this.helper.message(res.msg)
            }
        })
        this.http.get('WechatAppletAnalysis/equipFlow', {page : 1, limit: 20}).subscribe(res => {
            if (res.code == 0) {
                this.netObj = res.page
            }else {
                this.helper.message(res.msg)
            }
        })
    }

    ngOnInit() {

    }


    getSmallPieOption(canvas, width, height, xValue, yValue) {
        let data : Array<object> = [{ x: '1', y: yValue }]
        let fCharts : any = new F2.Chart({
            el: canvas,
            width,
            height,
            padding:[10,'auto','auto',0],
            pixelRatio: window.devicePixelRatio
        })
        let Shape : any = F2.Shape, G : any = F2.G, Util : any = F2.Util, Global : any = F2.Global, Vector2 : any = G.Vector2
        Shape.registerShape('interval', 'tick', {
            draw: function draw(cfg, container) {
                let points = this.parsePoints(cfg.points)
                let style = Util.mix({ stroke: cfg.color }, Global.shape.interval, cfg.style);
                if (cfg.isInCircle) {
                    let newPoints = points.slice(0)
                    if (this._coord.transposed) {
                        newPoints = [ points[0], points[3], points[2], points[1] ];
                    }
                    let _cfg$center = cfg.center, x = _cfg$center.x, y = _cfg$center.y;
            
                    let v = [1, 0],
                        v0 = [newPoints[0].x - x, newPoints[0].y - y],
                        v1 = [newPoints[1].x - x, newPoints[1].y - y],
                        v2 = [newPoints[2].x - x, newPoints[2].y - y],
                        startAngle = Vector2.angleTo(v, v1),
                        endAngle = Vector2.angleTo(v, v2),
                        r0 = Vector2.length(v0),
                        r = Vector2.length(v1)
                    startAngle >= 1.5 * Math.PI && (startAngle = startAngle - 2 * Math.PI)
                    endAngle >= 1.5 * Math.PI && (endAngle = endAngle - 2 * Math.PI)
            
                    let lineWidth = r - r0,
                        newRadius = r - lineWidth / 2
            
                    return container.addShape('Arc', {
                        className: 'interval',
                        attrs: Util.mix({
                            x: x,
                            y: y,
                            startAngle: startAngle,
                            endAngle: endAngle,
                            r: newRadius,
                            lineWidth: lineWidth,
                            lineCap: 'round'
                        }, style)
                    })
                }
            }
        })
               
        fCharts.source(data, {
            y: {
                max: 100,
                min: 0
            }
          })
        fCharts.axis(false)
        fCharts.tooltip(false)
        fCharts.coord('polar', {
            transposed: true,
            innerRadius: 0.8,
            radius: 0.99
        })
        
        fCharts.guide().arc({
            start: [0, 0],
            end: [1, 99.98],
            top: false,
            style: {
                lineWidth: 10,
                stroke: '#e1e4ec'
            }
        })
        fCharts.guide().text({
            position: ['42%', '50%'],
            content: yValue,
            style: {
                fill: '#333333', // 文本颜色
                fontSize: '26', // 文本大小
                fontWeight: 'bold' // 文本粗细
            },
        }); 
        fCharts.guide().text({
            position: ['68%', '50%'],
            content: '分',
            style: {
              fill: '#333333', // 文本颜色
              fontSize: '12', // 文本大小
            },
        }); 
        fCharts.guide().text({
            position: ['50%', '68%'],
            content: xValue,
            style: {
                fill: '#333333', // 文本颜色
                fontSize: '10', // 文本大小
            },
        }); 
        fCharts.interval().position('x*y').color('l(0) 0:#57abfe 1:#12d6ea').size(10).shape('tick').animate({
            appear: {
                duration: 1200,
                easing: 'cubicIn',
                animation: function animation(shape, animateCfg) {
                    var startAngle = shape.attr('startAngle');
                    var endAngle = shape.attr('endAngle');
                    shape.attr('endAngle', startAngle);
                    shape.animate().to(Util.mix({
                    attrs: {
                        endAngle: endAngle
                    }
                    }, animateCfg)).onUpdate(function (frame) {
                    })
                }
            }
        });
        fCharts.render();
        return fCharts;
    }

}
