import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NavigationExtras, Router } from '@angular/router';
import { DireccionService } from '../../services/direccion/direccion.service';

@Component({
  selector: 'app-popinfo',
  templateUrl: './popinfo.component.html',
  styleUrls: ['./popinfo.component.scss'],
})
export class PopinfoComponent implements OnInit {
  public producto: any;
  public popoverController: any;
  public direccion: any;

  constructor(
    public navParams: NavParams,
    public api: ApiService,
    public router: Router,
    public direccionService: DireccionService
  ) {
    this.producto = this.navParams.get('producto');
    this.direccion = this.navParams.get('direccion');
    this.popoverController = this.navParams.get('popoverCtrl');
  }

  ngOnInit() { }

  /**
   *
   * Function for delete product of the cart.
   *
   * Translate (Función para eliminar el producto del carrito).
   */
  async quitar() {
    this.api.MostrarAlert(
      'Eliminar producto',
      '¿Está seguro?',
      () => { },
      () => {
        this.popoverController.dismiss();
      }
    );
  }

  /**
 *
 * Function for delete direccion 
 *
 */
  async quitarDireccion() {
    this.api.MostrarAlert(
      'Eliminar dirección',
      '¿Está seguro?',
      () => {
        this.popoverController.dismiss();
      },
      () => {
        this.direccionService.delete(this.direccion.id);
        this.popoverController.dismiss();
      }
    );
  }

  /**
   * get data of product has been selected.
   *
   * Translate (obtener los datos del producto que ha sido seleccionado).
   */
  select_product() {
    /**
     * Iteration of the array of products.
     *
     * Translate (iteración del arreglo de productos).
     */


  }

  /**
   * Function for get the product detail selected.
   *
   * Translate (Función para obtener el detalle del producto seleccionado).
   */
  async getProductDetail() {
    this.api.MostarLoading();
    this.popoverController.dismiss();
    const url = '/producto/' + this.producto.producto.id;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          let navigationExtras: NavigationExtras = {
            state: this.producto,
          };
          this.api.QuitarLoading();
          console.log("navigationExtras", navigationExtras);

          this.router.navigate([url], navigationExtras);
        } else {
          this.api.QuitarLoading();
          this.api.presentToast('No existe el producto');
        }
      },
      async (e) => await this.api.QuitarLoading());
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function select_direccion
   * @description Obtiene la direccion, redirige a detalle de direccion y pasa la direccion por parametro
   */
  select_direccion() {
    const url = '/direccion';
    const navigationExtras: NavigationExtras = {
      state: { direccion: this.direccion },
    };
    this.popoverController.dismiss();
    this.router.navigate([url], navigationExtras);
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function predeterminada
   * @description Cambia una direccion a predeterminada 
   */
  async predeterminada() {
    const direcion = {
      id: this.direccion.id,
      defaultDireccion: true,
      idusuario: this.api.user.usuario.id
    };
    this.popoverController.dismiss();
    await this.direccionService.establecerPredeterminada(direcion);
    console.log(this.direccion);
  }
}
