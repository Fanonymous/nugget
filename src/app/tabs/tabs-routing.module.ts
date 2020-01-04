import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'infomation',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../infomation/infomation.module').then(m => m.InfomationPageModule)
          }
        ]
      },
      {
        path: 'teaching',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../teaching/teaching.module').then(m => m.TeachingPageModule)
          }
        ]
      },
      {
        path: 'analysis',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../analysis/analysis.module').then(m => m.AnalysisPageModule)
          }
        ]
      },
      {
        path: 'mycenter',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../mycenter/mycenter.module').then(m => m.MycenterPageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/analysis',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
