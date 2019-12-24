import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalysisPageRoutingModule } from './analysis-routing.module';

import { AnalysisPage } from './analysis.page';

import { NgxEchartsModule } from 'ngx-echarts'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxEchartsModule,
    AnalysisPageRoutingModule
  ],
  declarations: [AnalysisPage]
})
export class AnalysisPageModule {}
