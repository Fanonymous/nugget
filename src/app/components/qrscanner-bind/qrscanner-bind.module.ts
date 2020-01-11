import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrscannerBindPageRoutingModule } from './qrscanner-bind-routing.module';

import { QrscannerBindPage } from './qrscanner-bind.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrscannerBindPageRoutingModule
  ],
  declarations: [QrscannerBindPage]
})
export class QrscannerBindPageModule {}
