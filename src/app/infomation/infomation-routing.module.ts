import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfomationPage } from './infomation.page';

const routes: Routes = [
  {
    path: '',
    component: InfomationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfomationPageRoutingModule {}
