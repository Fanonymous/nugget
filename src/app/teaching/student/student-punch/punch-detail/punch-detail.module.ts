import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PunchDetailPageRoutingModule } from './punch-detail-routing.module';

import { PunchDetailPage } from './punch-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PunchDetailPageRoutingModule
  ],
  declarations: [PunchDetailPage]
})
export class PunchDetailPageModule {}
