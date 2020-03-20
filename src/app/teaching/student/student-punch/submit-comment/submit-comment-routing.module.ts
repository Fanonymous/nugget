import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitCommentPage } from './submit-comment.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitCommentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitCommentPageRoutingModule {}
