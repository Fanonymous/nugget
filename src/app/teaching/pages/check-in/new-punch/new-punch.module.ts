import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPunchPageRoutingModule } from './new-punch-routing.module';

import { NewPunchPage } from './new-punch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPunchPageRoutingModule
  ],
  declarations: [NewPunchPage]
})
export class NewPunchPageModule {}
