import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeachingPage } from './teaching.page';

const routes: Routes = [
  {
    path: '',
    component: TeachingPage
  },
  {
    path: 'time-table',
    loadChildren: () => import('./pages/time-table/time-table.module').then( m => m.TimeTablePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachingPageRoutingModule {}
