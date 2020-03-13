import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPunchPage } from './new-punch.page';

const routes: Routes = [
  {
    path: '',
    component: NewPunchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPunchPageRoutingModule {}
