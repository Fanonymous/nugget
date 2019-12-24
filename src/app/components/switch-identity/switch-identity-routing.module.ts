import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwitchIdentityPage } from './switch-identity.page';

const routes: Routes = [
  {
    path: '',
    component: SwitchIdentityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwitchIdentityPageRoutingModule {}
