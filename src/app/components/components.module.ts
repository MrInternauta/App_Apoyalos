import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DireccionComponent } from './direccion/direccion.component';
//Mapa
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';

import { FormsModule } from '@angular/forms';

import { PipesModule } from '../pipes/pipes.module';
import { PopinfoComponent } from './popinfo/popinfo.component';

@NgModule({
  declarations: [HeaderComponent, DireccionComponent,PopinfoComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    PipesModule,
    // AgmSnazzyInfoWindowModule,
    AgmCoreModule.forRoot({
    apiKey:environment.apiKey
  })

  ], exports: [
    HeaderComponent, DireccionComponent, PopinfoComponent
  ]
})
export class ComponentsModule { }
