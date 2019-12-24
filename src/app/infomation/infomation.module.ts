import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfomationPageRoutingModule } from './infomation-routing.module';

import { InfomationPage } from './infomation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfomationPageRoutingModule
  ],
  declarations: [InfomationPage]
})
export class InfomationPageModule {}
