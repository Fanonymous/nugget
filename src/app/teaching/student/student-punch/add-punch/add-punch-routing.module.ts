import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPunchPage } from './add-punch.page';

const routes: Routes = [
  {
    path: '',
    component: AddPunchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPunchPageRoutingModule {}
