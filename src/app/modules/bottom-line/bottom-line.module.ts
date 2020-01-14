import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomLineComponent } from './bottom-line.component'
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [BottomLineComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [BottomLineComponent]
})
export class BottomLineModule { }
