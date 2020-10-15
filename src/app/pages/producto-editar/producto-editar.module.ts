import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductoEditarPageRoutingModule } from './producto-editar-routing.module';

import { ProductoEditarPage } from './producto-editar.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductoEditarPageRoutingModule,
    ComponentsModule, PipesModule
  ],
  declarations: [ProductoEditarPage]
})
export class ProductoEditarPageModule {}
