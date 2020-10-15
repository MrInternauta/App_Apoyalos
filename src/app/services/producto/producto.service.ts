import { Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ModalController } from '@ionic/angular';
import { ProductoEditarPage } from '../../pages/producto-editar/producto-editar.page';
@Injectable({
  providedIn: 'root',
})
export class ProductoService implements OnDestroy {


  loading: any;
  // Name of the table (singular)
  tableName: string = 'producto';
  // Name of the plural table
  pluralName: string = 'Productos';
  // data from the request
  data: any;
  // typeView = 0 => se obtiene el producto desde la vista de menu de productos
  // typeView = 1 => se obtiene el producto desde la vista de carrito
  typeView = 0;


  public producto: any;
  cantidad = 0;
  precio = 0;
  umedidaM: any;
  umedidaDefault: any;
  comentario: any;
  banderaClasificacion: Boolean;
  banderaMedida: Boolean;
  nuevoProducto: any;
  misClasificaciones: any[] = [];
  selected = [];

  constructor(public api: ApiService, public modalController: ModalController) { }

  ngOnDestroy() {
    console.log('Service destroy')
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function setNames
   * @description Set names of tableName & pluralName
   */
  setNames(tableName: string, pluralName: string): void {
    this.pluralName = pluralName;
    this.tableName = tableName;
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getAll
   * @description Get all elements 
   * @returns {object} return a Object or  a false value
   */
  async getAll(): Promise<void> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          console.log(data.data);
          if (data.data.length < 1) {
            this.api.presentToast('No existen ' + this.pluralName);
            this.api.navegateAndDestroy('/home');
            this.ngOnDestroy();
          } else {
            this.data = data.data;
          }
        } else {
          this.api.presentToast('No existen ' + this.pluralName);
          this.api.navegateAndDestroy('/home');
          this.ngOnDestroy();
        }
        await this.api.QuitarLoading();
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        }
        await this.api.QuitarLoading();
      }
    );
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getAllByCategoriaId
   * @description Get all elements by categoriaId
   * @returns {object} return a Object or  a false value
   */
  async getAllByCategoriaId(categoriaId: string): Promise<void> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName + '/' + categoriaId;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          console.log(data.data);
          if (data.data.length < 1) {
            this.api.presentToast('No existen ' + this.pluralName);
            this.api.navegateAndDestroy('/home');
            this.ngOnDestroy();
          } else {
            this.data = data.data;
          }
        } else {
          this.api.presentToast('No existen ' + this.pluralName);
          this.api.navegateAndDestroy('/home');
          this.ngOnDestroy();
        }
        await this.api.QuitarLoading();
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        }
        await this.api.QuitarLoading();
      }
    );
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getById
   * @description get one element
   * @param {string} id element id
   * @returns {object} return a object response
   */
  async getOne(id: string): Promise<void> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName + '/detail/' + id;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          this.data = data.data;
        } else {
          this.api.presentToast('No existe ' + this.tableName);
        }
        await this.api.QuitarLoading();
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        }
        await this.api.QuitarLoading();
      }
    );
  }


    /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getById
   * @description get one element
   * @param {string} id element id
   * @returns {object} return a object response
   */
  async Create(producto: any): Promise<void> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName 
    this.api.post(url, producto).subscribe(
      async (data: any) => {
        if (data.status) {
          this.api.presentToast(data.message);
          //Abrir modal para editar el producto
          this.presentModal(producto)
        }
        console.log(data);
        await this.api.QuitarLoading();
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        }
        await this.api.QuitarLoading();
      }
    );

    
  }
  async presentModal(producto: any) {
    const modal = await this.modalController.create({
      component: ProductoEditarPage,
      componentProps: {producto}
    });
    return await modal.present();
  }

}
