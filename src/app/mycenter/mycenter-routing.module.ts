import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MycenterPage } from './mycenter.page';


const routes: Routes = [
  {
    path: '',
    component: MycenterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MycenterPageRoutingModule {}
