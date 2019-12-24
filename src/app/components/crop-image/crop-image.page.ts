import { Component, OnInit, ViewChild } from '@angular/core';

import { Crop } from '@ionic-native/crop/ngx';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.page.html',
  styleUrls: ['./crop-image.page.scss'],
})
export class CropImagePage implements OnInit {
    private imageSrc: string

    constructor(private crop: Crop) { }

    ngOnInit() {
        console.log(this.crop.crop)
        // this.crop.crop('../../../assets/img/avatar.png', { quality: 100 }).then(img => {
        //     console.log(img)
        // })
    }
    cropImage() {
        this.crop.crop('../../../assets/img/avatar.png', { quality: 100 }).then(img => {
            console.log(img)
        })
    }

}
