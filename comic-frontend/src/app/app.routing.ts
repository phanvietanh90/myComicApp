/**
 * Created by griga on 7/11/16.
 */


import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";
import {AuthGuard} from "./core/_auth/auth.guard";

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        data: {pageTitle: 'Home'},
        children: [
            {
                path: '', redirectTo: 'home-page', pathMatch: 'full'
            },
            {
                path: 'home-page',
                loadChildren: 'app/+home-page/home-page.module#HomePageModule',
                data: {pageTitle: 'Home Page'}
            },
            {
                path: 'create-story',
                loadChildren: 'app/+create-story/create-story.module#CreateStoryModule',
                data: {pageTitle: 'Create Story'}
            },
            {
                path: 'my-account',
                loadChildren: 'app/+my-account/my-account.module#MyAccountModule',
                data: {pageTitle: 'Account detail'}
            },

        ]
    },

    {path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},

    {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
