import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputDialogComponent } from './input-dialog.component'
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ InputDialogComponent ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  exports: [ InputDialogComponent ]
})
export class InputDialogModule { }
