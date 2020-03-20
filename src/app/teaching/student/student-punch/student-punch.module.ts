import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentPunchPageRoutingModule } from './student-punch-routing.module';

import { StudentPunchPage } from './student-punch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentPunchPageRoutingModule
  ],
  declarations: [StudentPunchPage]
})
export class StudentPunchPageModule {}
