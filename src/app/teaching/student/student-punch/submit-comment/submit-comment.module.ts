import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KeyboardComponent } from '../../../modules/keyboard/keyboard.component'
import { KeyboardModule } from '../../../modules/keyboard/keyboard.module'

import { SubmitCommentPageRoutingModule } from './submit-comment-routing.module';

import { SubmitCommentPage } from './submit-comment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeyboardModule,
    SubmitCommentPageRoutingModule
  ],
  declarations: [SubmitCommentPage],
  entryComponents: [ KeyboardComponent ]
})
export class SubmitCommentPageModule {}
