import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckInPageRoutingModule } from './check-in-routing.module';

import { CheckInPage } from './check-in.page';

import { BottomLineModule } from '../../../modules/bottom-line/bottom-line.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BottomLineModule,
    CheckInPageRoutingModule
  ],
  declarations: [CheckInPage]
})
export class CheckInPageModule {}
