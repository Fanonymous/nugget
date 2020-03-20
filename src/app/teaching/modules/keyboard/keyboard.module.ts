import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeyboardComponent } from './keyboard.component'
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [ KeyboardComponent ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  exports: [ KeyboardComponent ]
})
export class KeyboardModule { }
