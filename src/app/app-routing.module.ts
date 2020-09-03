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
    path: 'producto/:id',
    loadChildren: () => import('./pages/producto/producto.module').then(m => m.ProductoPageModule), canActivate: [LoginGuardGuard]
  },

  {
    path: 'productos/:id',
    loadChildren: () => import('./pages/productos/productos.module').then(m => m.ProductosPageModule), canActivate: [LoginGuardGuard]
  },
  {
    path: 'direccion',
    loadChildren: () => import('./pages/direccion/direccion.module').then(m => m.DireccionPageModule), canActivate: [LoginGuardGuard]
  },
  {
    path: 'direcciones',
    loadChildren: () => import('./pages/direcciones/direcciones.module').then(m => m.DireccionesPageModule), canActivate: [LoginGuardGuard]
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./pages/favoritos/favoritos.module').then(m => m.FavoritosPageModule), canActivate: [LoginGuardGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule), canActivate: [LoginGuardGuard]
  },
  { path: '**', redirectTo: 'welcome', }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
