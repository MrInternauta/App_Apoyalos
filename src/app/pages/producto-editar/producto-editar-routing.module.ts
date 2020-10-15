import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoEditarPage } from './producto-editar.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoEditarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoEditarPageRoutingModule {}
