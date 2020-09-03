import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ProductoService } from '../producto/producto.service';
import { DireccionService } from '../direccion/direccion.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class FavoritoService {
  loading: any;
  // Name of the table (singular)
  tableName: string = 'favorito';
  // Name of the plural table
  pluralName: string = 'favoritos';
  // data from the request
  data: any;
  dataArr: any;

  constructor(public api: ApiService, private router: Router) {}

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
   * @function getAllByUserId
   * @description Get all elements by userId
   * @returns {Promise<any>} return a Object or  a false value
   */
  async getAllByUserId(): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName + '/' + this.api.user.usuario.id;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast('No existen ' + this.pluralName);
          } else {
            this.dataArr = data.data;
            console.log(this.dataArr);
          }
        } else {
          this.api.presentToast('No existen ' + this.pluralName);
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
   * @function create
   * @description Create a new element
   * @param {any} element to insert
   * @returns {Promise<any>} return a object response
   */
  async create(element: any): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName;
    await this.api.post(url, element).subscribe(
      async (data: any) => {
        console.log(data);
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast('No se pudo crear ' + this.tableName);
          } else {
            this.data = data.data;
            this.getAllByUserId();
            this.api.presentToast('Se agrego correctamente a favoritos.');
          }
        } else {
          this.api.presentToast('No se pudo crear ' + this.tableName);
        }
        await this.api.QuitarLoading();
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        } else if (e.status === 500) {
          this.api.presentToast(e.error.message);
        }
        await this.api.QuitarLoading();
      }
    );
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function detele
   * @description Update a element
   * @param {any} element to update
   * @returns {Promise<any>} return a object response
   */

  async detele(element: any): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName + '/delete';
    this.api.post(url, element).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast(
              'No se pudo eliminar el producto de favoritos.'
            );
          } else {
            console.log(this.dataArr, element);
            this.dataArr = this.dataArr.filter(
              (fav: any) => element.idproducto !== fav.id
            );
            console.log(this.dataArr, element);
            this.data = data.data;
            this.api.presentToast('Favorito eliminado.');
            // this.router.navigate(['/favoritos']);
            console.log(this.data);
          }
        } else {
          this.api.presentToast(
            'No se pudo eliminar el producto de favoritos.'
          );
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
}
