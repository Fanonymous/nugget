import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeachingPageRoutingModule } from './teaching-routing.module';

import { TeachingPage } from './teaching.page';

import { BottomLineModule } from '../modules/bottom-line/bottom-line.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BottomLineModule,
    TeachingPageRoutingModule
  ],
  declarations: [TeachingPage]
})
export class TeachingPageModule {}
