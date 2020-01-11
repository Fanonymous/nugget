import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrscannerBindPage } from './qrscanner-bind.page';

const routes: Routes = [
  {
    path: '',
    component: QrscannerBindPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrscannerBindPageRoutingModule {}
