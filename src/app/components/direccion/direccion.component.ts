import { Component, OnInit, Input, ViewChild , ElementRef} from '@angular/core';
import { DireccionService } from 'src/app/services/service.index';
import { AgmMap } from '@agm/core';


declare var google: any;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.scss'],
})
export class DireccionComponent implements OnInit {
  @Input() direccion: any;
  @Input() costoEnvio: number;
  @Input() cambiarD: boolean;
  public agmMap: AgmMap


  constructor(
    public direccionService: DireccionService) { 
    console.log(this.direccionService.data, this.direccionService.dataArr);
    
  }

  ngOnInit() {
    if (this.agmMap) {
      this.agmMap.triggerResize();
    }
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function changeDirecction
   * @description changeDirecction permite cambiar la direccion
   */
  changeDirecction(): void {
    this.direccionService.api.presentToast('No se puede cambiar la dirección.');
  }



}
