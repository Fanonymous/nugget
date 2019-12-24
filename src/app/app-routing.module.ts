import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginGuard } from './guards/login.guard'

const routes: Routes = [
    {
        path : '',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
        canActivate : [LoginGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
    },
    {
        path: 'home',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    },
    {
        path: 'setting',
        loadChildren: () => import('./components/setting/setting.module').then( m => m.SettingPageModule)
    },
    {
        path: 'crop-image',
        loadChildren: () => import('./components/crop-image/crop-image.module').then( m => m.CropImagePageModule)
    },
    {
        path: 'update-info',
        loadChildren: () => import('./components/update-info/update-info.module').then( m => m.UpdateInfoPageModule)
    },
    {
        path: 'switch-identity',
        loadChildren: () => import('./components/switch-identity/switch-identity.module').then( m => m.SwitchIdentityPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
