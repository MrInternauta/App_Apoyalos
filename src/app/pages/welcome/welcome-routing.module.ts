import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { welcomePage } from "./welcomePage";

const routes: Routes = [
  {
    path: '',
    component: welcomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class welcomePageRoutingModule {}
