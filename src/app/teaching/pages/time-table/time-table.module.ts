import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeTablePageRoutingModule } from './time-table-routing.module';

import { TimeTablePage } from './time-table.page';

import { FilterDialogComponent } from '../../modules/filter-dialog/filter-dialog.component'
import { FilterDialogModule } from '../../modules/filter-dialog/filter-dialog.module'

import { BottomLineModule } from '../../../modules/bottom-line/bottom-line.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BottomLineModule,
    FilterDialogModule,
    TimeTablePageRoutingModule,
  ],
  declarations: [TimeTablePage],
  entryComponents: [FilterDialogComponent]
})
export class TimeTablePageModule {}
