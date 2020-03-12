import { CommonModule, } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AuthenticateGuard } from './guards/auth/auth.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

/**
 * As configurações para as rotas que NÃO precisam de autenticação
 */
const unAuthenticatedRoute = { canActivate: [AuthenticateGuard], data: { routeToRedirect: environment.config.redirectToWhenAuthenticated, redirectIfAuthenticated: true } };

/**
 * As configurações para as rotas que PRECISAM de autenticação
 */
const authenticatedRoute = { canActivate: [AuthenticateGuard], data: { routeToRedirect: environment.config.redirectToWhenUnauthenticated, redirectIfNotAuthenticated: true } };

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule' },
    ],
    ...authenticatedRoute,
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginModule',
    ...unAuthenticatedRoute,
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
})

export class AppRoutingModule {}
