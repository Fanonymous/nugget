import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwitchIdentityPageRoutingModule } from './switch-identity-routing.module';

import { SwitchIdentityPage } from './switch-identity.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwitchIdentityPageRoutingModule
  ],
  declarations: [SwitchIdentityPage]
})
export class SwitchIdentityPageModule {}
