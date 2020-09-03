import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PopinfoComponent } from 'src/app/components/popinfo/popinfo.component';

import { DireccionesPageRoutingModule } from './direcciones-routing.module';

import { DireccionesPage } from './direcciones.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { environment } from 'src/environments/environment';
//Mapa
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey
    }),
    DireccionesPageRoutingModule
  ],
  declarations: [DireccionesPage],
  entryComponents: [PopinfoComponent]
})
export class DireccionesPageModule {}
