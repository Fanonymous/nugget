import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CropImagePageRoutingModule } from './crop-image-routing.module';

import { CropImagePage } from './crop-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropImagePageRoutingModule
  ],
  declarations: [CropImagePage]
})
export class CropImagePageModule {}
