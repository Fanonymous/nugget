import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPunchPage } from './edit-punch.page';

const routes: Routes = [
  {
    path: '',
    component: EditPunchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPunchPageRoutingModule {}
