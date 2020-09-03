import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {
          UsuarioService,
          LoginGuardGuard,
          SubirarhivoService,
          AdminGuardGuard,
          CategoriaService,
          ApiService,
          DireccionService,
          ProductoService,
          FavoritoService,
          
          } from './service.index';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientModule,
  ],
  providers: [
          UsuarioService,
          LoginGuardGuard,
          SubirarhivoService,
          AdminGuardGuard,
          CategoriaService,
          DireccionService,
          ApiService,
          ProductoService,
          FavoritoService,
        ]
})
export class ServiceModule { }
