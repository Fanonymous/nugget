import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeachingPageRoutingModule } from './teaching-routing.module';

import { TeachingPage } from './teaching.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeachingPageRoutingModule
  ],
  declarations: [TeachingPage]
})
export class TeachingPageModule {}
