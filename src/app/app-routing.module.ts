import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { LogoutGuard } from './services/guards/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), canActivate: [LoginGuardGuard] },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.welcomePageModule), canActivate: [LogoutGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule), canActivate: [LogoutGuard]
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninPageModule), canActivate: [LogoutGuard]
  },

  {
    path: 'productos/:id',
    loadChildren: () => import('./pages/productos/productos.module').then(m => m.ProductosPageModule), canActivate: [LoginGuardGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule), canActivate: [LoginGuardGuard]
  },
  {
    path: 'donar',
    loadChildren: () => import('./pages/donar/donar.module').then( m => m.DonarPageModule)
  },
  {
    path: 'producto-editar/:id',
    loadChildren: () => import('./pages/producto-editar/producto-editar.module').then( m => m.ProductoEditarPageModule)
  },

  { path: '**', redirectTo: 'welcome', },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
