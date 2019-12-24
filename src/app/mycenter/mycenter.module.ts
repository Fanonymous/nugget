import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MycenterPageRoutingModule } from './mycenter-routing.module';

import { MycenterPage } from './mycenter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MycenterPageRoutingModule,
  ],
  declarations: [MycenterPage]
})
export class MycenterPageModule {}
