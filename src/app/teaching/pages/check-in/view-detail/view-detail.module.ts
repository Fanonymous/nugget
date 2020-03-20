import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputDialogComponent } from '../../../modules/input-dialog/input-dialog.component'
import { InputDialogModule } from '../../../modules/input-dialog/input-dialog.module'

import { PopperMenuComponent } from '../../../modules/popper-menu/popper-menu.component'
import { PopperMenuModule } from '../../../modules/popper-menu/popper-menu.module'

import { ViewDetailPageRoutingModule } from './view-detail-routing.module';

import { ViewDetailPage } from './view-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputDialogModule,
    PopperMenuModule,
    ViewDetailPageRoutingModule
  ],
  declarations: [ViewDetailPage],
  entryComponents: [InputDialogComponent, PopperMenuComponent]
})
export class ViewDetailPageModule {}
