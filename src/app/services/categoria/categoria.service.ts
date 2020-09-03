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
  constructor(private api: ApiService) {}

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
    await this.api.MostarLoading();
    const url = '/' + this.tableName;
    return await this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast('No existen ' + this.pluralName);
          } else {
            this.data = data.data;
            this.data.forEach(element => {
              if (element.imagenurl == 'default.jpg') {
                element.imagenurl = 'default.png'
              }
            });
            console.log(this.data);
            
          }
        } else {
          this.api.presentToast('No existen ' + this.pluralName);
        }
        await this.api.QuitarLoading();
      },
      async (e) => {
        if (e.status === 401) {
          console.log('Obtenindo token');
          this.api.user.updateToken();
        }
        await this.api.QuitarLoading();
      }
    );
  }
}
