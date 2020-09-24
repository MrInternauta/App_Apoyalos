import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  loading: any;
  // Name of the table (singular)
  tableName: string = 'categorias';
  // Name of the plural table
  pluralName: string = 'Categorias';
  // data from the request
  data: any;
  constructor(public api: ApiService) {}

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function setNames
   * @description Set names of tableName & pluralName
   */
  setNames(tableName: string, pluralName: string) {
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
  async getAll() {
    let message = '';
    return new Promise(async (resolve, reject)=> {
      await this.api.MostarLoading();
      const url = '/' + this.tableName;
      return await this.api.get(url).subscribe(
        async (data: any) => {
 
          if (data.data) {
            if (data.data.length < 1) {
              message = 'No existen ' + this.pluralName;
              this.api.presentToast(message);
              reject(message)
            } else {
              this.data = data.data;
              this.data.forEach(element => {
                if (element.imagenurl == 'default.png') {
                  element.imagenurl = 'default.png'
                }
              });
              resolve(this.data);
            }
          } else {
            message = 'No existen ' + this.pluralName;
            this.api.presentToast(message);
            reject(message);
          }
          await this.api.QuitarLoading();
        },
        async (e) => {
          if (e.status === 401) {
            console.log('Obtenindo token');
            this.api.user.updateToken();
          }
          await this.api.QuitarLoading();
          reject(message);
        }
      );
    })
  }
}
