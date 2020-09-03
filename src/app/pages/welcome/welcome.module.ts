import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { welcomePageRoutingModule } from './welcome-routing.module';

import { welcomePage } from "./welcomePage";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    welcomePageRoutingModule
  ],
  declarations: [welcomePage]
})
export class welcomePageModule {

}


