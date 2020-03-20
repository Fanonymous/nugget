import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentPunchPage } from './student-punch.page';

const routes: Routes = [
  {
    path: '',
    component: StudentPunchPage
  },
  {
    path: 'punch-detail',
    loadChildren: () => import('./punch-detail/punch-detail.module').then( m => m.PunchDetailPageModule)
  },
  {
    path: 'add-punch',
    loadChildren: () => import('./add-punch/add-punch.module').then( m => m.AddPunchPageModule)
  },
  {
    path: 'edit-punch',
    loadChildren: () => import('./edit-punch/edit-punch.module').then( m => m.EditPunchPageModule)
  },
  {
    path: 'submit-comment',
    loadChildren: () => import('./submit-comment/submit-comment.module').then( m => m.SubmitCommentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentPunchPageRoutingModule {}
