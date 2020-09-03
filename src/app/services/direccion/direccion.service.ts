import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  loading: any;
  // Name of the table (singular)
  tableName: string = 'direccion';
  // Name of the plural table
  pluralName: string = 'Direcciones';
  // data from the request
  data: any;
  dataArr: any = [];
  abastosArr: any = [];
  // Punto medio de Hermosillo
  direccionCentral: any = { latitud: 29.083165, longitud: -110.976592 };

  constructor(public api: ApiService,
    public router: Router,
  ) { }
  

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function setNames
   * @description Set names of tableName & pluralName
   */
  setNames(tableName: string, pluralName: string): any {
    this.pluralName = pluralName;
    this.tableName = tableName;
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getAllByUsernull
   * @description Get all elements by userId
   * @param {boolean} getbyAbastos Obtener ubicacion de abastos del rio si es true o false si es la del usuario
   * @returns {Promise<any>} return a Promise<any>
   */
  async getAllByUsernull(getbyAbastos = true): Promise<any> {
    const url = '/' + this.tableName + '/-1';
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.abastosArr = data.data;
            // this.api.presentToast('No existen ' + this.pluralName);
          } else {
            this.abastosArr = data.data;
            console.log(this.abastosArr);
          }
        } else {
          this.api.presentToast('No existen ' + this.pluralName);
        }
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        }
      }
    );
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getAllByUserId
   * @description Get all elements by userId
   * @returns {Promise<any>} return a Promise<any>
   */
  async getAllByUserId(): Promise<any> {
    const url = '/' + this.tableName + '/' + this.api.user.usuario.id;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.dataArr = data.data;
            // this.api.presentToast('No existen ' + this.pluralName);
          } else {
            this.data = null;
            this.dataArr = data.data;
            // Poner de primero a la direccion por defecto
            this.dataArr = this.dataArr.sort(function (a, b) {
              if (a.default == false || b.default == true) {
                return 1;
              }
              if (a.default == true || b.default == false) {
                return -1;
              }
              return 0;
            });
            console.log(this.dataArr);
          }
        } else {
          this.api.presentToast('No existen ' + this.pluralName);
        }
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        }
      }
    );
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getAllByUserId
   * @description Get default element by userId
   * @returns {Promise<any>} return a Promise<any>
   */
  async getDefaultByUserId(): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName + '/default/' + this.api.user.usuario.id;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast('No existe ' + this.tableName);
          } else {
            this.dataArr = null;
            this.data = data.data;

            console.log(this.data);
          }
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
   * @returns {Promise<any>} return a Promise<any>
   */
  async getOne(id: string): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName + '/detail/' + id;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          this.dataArr = null;
          this.data = data.data;
          console.log(this.data);
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
   * @function create
   * @description Create a new element
   * @param {any} element to insert
   * @returns {Promise<any>} return a Promise<any>
   */
  async create(element: any): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName;
    this.api.post(url, element).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast('No se pudo crear ' + this.tableName);
          } else {
            // this.data = data.data;
            // Redirigir a direcciones
            this.dataArr.push(data.data);
            this.api.presentToast('Dirección creada correctamente');
            this.router.navigateByUrl('/direcciones');
          }
        } else {
          this.api.presentToast('No se pudo crear ' + this.tableName);
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
   * @function update
   * @description Update a element
   * @param {any} element to update
   * @returns {Promise<any>} return a Promise<any>
   */
  async update(element: any): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName;
    this.api.put(url, element).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast('No se pudo actualizar ' + this.tableName);
          } else {
            this.dataArr = this.dataArr.map((direccion: any) => {
              if (direccion.id == data.data[0].id) {
                console.log(direccion);
                direccion = data.data[0];
              }
              return direccion;
            });
            this.api.presentToast('Dirección actualizada correctamente');
          }
        } else {
          this.api.presentToast('No se pudo actualizar ' + this.tableName);
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
   * @function delete
   * @description Update a element
   * @param {string} direccionId to update
   */
  async delete(direccionId: string): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName + '/' + direccionId;
    this.api.delete(url, {}).subscribe(
      async (data: any) => {
        if (data.status) {
          this.dataArr = this.dataArr.filter((direccion: any) => direccion.id != direccionId);
          this.api.presentToast(data.message);
        }
        else {
          this.api.presentToast(data.message);
        }
        await this.api.QuitarLoading();
        this.router.navigateByUrl('/direcciones');
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
   * @function update
   * @description Update a element
   * @param {any} element to update
   * @returns {Promise<any>} return a Promise<any>
   */
  async establecerPredeterminada(element: any): Promise<any> {
    await this.api.MostarLoading();
    const url = '/' + this.tableName;
    this.api.put(url, element).subscribe(
      async (data: any) => {
        if (data.data) {
          if (data.data.length < 1) {
            this.api.presentToast('No se pudo establecer como predeterminada');
          } else {
            console.log(this.dataArr);
            this.data = data.data[0];
            this.dataArr = this.dataArr.map((direccion: any) => {
              if (this.data.id === direccion.id) {
                direccion.default = true;
              } else {
                if (direccion.default) {
                  direccion.default = false;
                }
              }
              return direccion;
            });
            this.data = null;
            console.log(this.dataArr);

            this.api.presentToast('Establecida como predeterminada');
          }
        } else {
          this.api.presentToast('No se pudo establecer como predeterminada');
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

  //CALCULA LA DISTANCIA KM DE PUNTO A PUNTO APARTIR DE (LAT, LONG) Origen y (LAT, LONG) destino
  calcular_distancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    let R = 6378.137; //Radio de la tierra en km
    let dLat = this.rad(lat2 - lat1);
    let dLong = this.rad(lon2 - lon1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    d = d * 1; //distancia aumentando la mitad
    return d.toFixed(3); //Retorna tres decimales
  }

  //RADIO
  rad(x: number) {
    return x * Math.PI / 180;
  }

  // Function for calculate distance of the user and selected price.
  calcular_precio(distanciaKm) {
    // La función Math.round() retorna el valor de un número redondeado al entero más cercano.
    let distanciaSeleccionada = Math.round(distanciaKm);
    let precio = 40;
    let listaPrecios = [
      {
        min: 0,
        max: 5,
        price: 40
      },
      {
        min: 6,
        max: 10,
        price: 70
      },
      {
        min: 10,
        max: 15,
        price: 100
      }
    ];
    let objPrecio = listaPrecios.filter((item)=> distanciaSeleccionada >= item.min && distanciaSeleccionada <= item.max);
    if (objPrecio.length > 0) {
      precio = objPrecio[0].price;
    }
    return precio;
  }

}


