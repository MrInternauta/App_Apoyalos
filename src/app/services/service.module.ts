import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {
          UsuarioService,
          LoginGuardGuard,
          SubirarhivoService,
          CategoriaService,
          ApiService,
          ProductoService,
          
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
          CategoriaService,
          ApiService,
          ProductoService,
        ]
})
export class ServiceModule { }
