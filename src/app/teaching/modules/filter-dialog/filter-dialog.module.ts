import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterDialogComponent } from './filter-dialog.component'
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ FilterDialogComponent ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  exports: [ FilterDialogComponent ]
})
export class FilterDialogModule { }
