import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPunchPageRoutingModule } from './edit-punch-routing.module';

import { EditPunchPage } from './edit-punch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPunchPageRoutingModule
  ],
  declarations: [EditPunchPage]
})
export class EditPunchPageModule {}
