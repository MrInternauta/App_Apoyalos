import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DireccionService } from '../../services/direccion/direccion.service';
import { PopoverController } from '@ionic/angular';
import { PopinfoComponent } from '../../components/popinfo/popinfo.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit, AfterContentInit {

  constructor(
    public direccionService: DireccionService,
    public popoverController: PopoverController,
    private api: ApiService
    ) {
  }

  async ngOnInit() {
    await this.api.MostarLoading();
    this.direccionService.getAllByUserId();
    setTimeout(async () => {
      console.log('Mapas');
      await this.api.QuitarLoading();
    }, 2500);
  }

  async ngAfterContentInit() {


    
  }

  /**
 *  Function for call popover controller.
 * 
 * @param direccionSelected is the direccion selected.
 * @param ev is the event controller.
 * 
 * Translate(Función para llamar el controlador de popover).
 */
  async presentPopover(direccionSelected, ev: any) {
    const popover = await this.popoverController.create({
      component: PopinfoComponent,
      event: ev,
      translucent: true,
      componentProps: {
        popoverCtrl: this.popoverController, // is popover created.
        direccion: direccionSelected // value of the direccion selected.
      }
    });

    return await popover.present();
  }

}
