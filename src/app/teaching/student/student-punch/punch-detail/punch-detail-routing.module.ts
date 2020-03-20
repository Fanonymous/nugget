import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PunchDetailPage } from './punch-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PunchDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PunchDetailPageRoutingModule {}
