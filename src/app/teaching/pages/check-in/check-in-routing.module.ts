import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckInPage } from './check-in.page';

const routes: Routes = [
  {
    path: '',
    component: CheckInPage
  },
  {
    path: 'new-punch',
    loadChildren: () => import('./new-punch/new-punch.module').then( m => m.NewPunchPageModule)
  },
  {
    path: 'view-detail',
    loadChildren: () => import('./view-detail/view-detail.module').then( m => m.ViewDetailPageModule)
  },
  {
    path: 'edit-punch',
    loadChildren: () => import('./edit-punch/edit-punch.module').then( m => m.EditPunchPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckInPageRoutingModule {}
