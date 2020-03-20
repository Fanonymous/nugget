import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopperMenuComponent } from './popper-menu.component'
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ PopperMenuComponent ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  exports: [ PopperMenuComponent ]
})
export class PopperMenuModule { }
