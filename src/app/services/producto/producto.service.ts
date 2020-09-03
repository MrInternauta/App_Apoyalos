import { Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FavoritoService } from '../favorito/favorito.service';
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

  constructor(public api: ApiService,
    private favoritS: FavoritoService) { }

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
 * Function for change the amount of the product from buttons of amount.
 *
 * @param value is amount selected.
 * @param umedida is unit of measurement.
 * @param typeCalculateAmount is the type of calculate amount of the product.
 * 
 * typeCalculateAmount = 1, se obtiene la cantidad desde los botones de cantidad.
 * typeCalculateAmount = 2, se obtiene la cantidad desde el input de cantidad.
 *
 * Translate(Función para cambiar la cantidad del producto desde los botones
 * de cantidad).
 */
  cantidadChange(value, umedida, typeCalculateAmount) {
    let UnidaM;

    // define type of calculate amount for the product.
    if (typeCalculateAmount == 1) {
      // increment o decrement of the amount of the product.
      if (this.cantidad + value > 0) {
        this.cantidad += value;
      }
    } else if (typeCalculateAmount == 2) {
      this.cantidad = Number(value.target.value);
    } else if (typeCalculateAmount == 3) {
      this.cantidad = 1;
    } else if (typeCalculateAmount == 4) {
      if (value > 0) {
        this.cantidad = value;
      }
    }

    // iteration for get ID of the unit of measurement.
    for (let IDMedida of this.producto.producto.unidadesMedida) {
      if (umedida == IDMedida.nombre) {
        umedida = IDMedida.id;
      }
    }
    if (umedida) {
      UnidaM = this.producto.producto.unidadesMedida.filter((data) => data.id === umedida);
    } else {
      UnidaM = this.producto.producto.unidadesMedida.filter((data) => data.default);
    }
    const precio = UnidaM.length && UnidaM[0].precio > 0 ? UnidaM[0].precio : this.producto.producto.precio;

    if (this.cantidad > 0) {
      this.precio = Number(this.cantidad) * Number(precio) + 0.0;
    }
  }

  /**
   * Function for update the unit of measurement of the product.
   *
   * @param measurement is the unit of measurement selected.
   *
   * Translate(Función para cambiar la unidad de medida del producto).
   */
  updateUnitOfMeasurement(nombreMedida) {
    if (nombreMedida) {
      this.umedidaM = nombreMedida;
      // iteration for get ID of the unit of measurement.
      for (let IDMedida of this.producto.producto.unidadesMedida) {
        if (nombreMedida == IDMedida.nombre) {
          this.producto.umedida = IDMedida.id;
          this.producto.umedidaStr = nombreMedida;
          this.cantidadChange(0, nombreMedida, 1);
        }
      }
    } else {
      // se asigna unidad de medida predefinida
      let umedida = this.producto.producto.unidadesMedida.filter(
        (data) => data.default
      );
      this.producto.umedida = umedida.id;
      this.producto.umedidaStr = umedida.nombre;
    }
  }

  /**
   * Function for update the classification of the product.
   *
   * @param classification is the classification selected.
   *
   * Translate(Función para cambiar la clasificación del producto).
   */
  updateClassification(Classification, opcion, volverApedir = false) {
    if (Classification && opcion) {
      // Crea el objeto de la nueva clasificacion
      const opcionObject = Classification.opciones.filter((data: any) => data.id === opcion);
      if (opcionObject[0]) {
        let clasificacion = JSON.parse(JSON.stringify(Classification));
        clasificacion.opcion = opcionObject[0];
        if (volverApedir) {
          clasificacion.nombre = opcion;
        }
        this.producto.producto.clasificacion.map(data => {
          data.opciones.map(opcionArr => {
            if (opcionArr.id == opcion) {
              opcionArr.selected = true;
            }
          });
        });
        // Verificar si ya existe
        this.misClasificaciones = this.misClasificaciones.filter((clasificacionItem: any) => clasificacion.id !== clasificacionItem.id);
        this.misClasificaciones.push(clasificacion);
      }
      // Delete data in the variables.
      Classification = null;
      opcion = null;
    } else {
      console.log('Sin seleccionar');
    }
  }



  /**
   * Function for add product to cart of shopping.
   *
   * @param producto
   * @param umedida
   * @param clasificacion
   * @param cantidad
   * @param comentario
   * @param volverapedir True or false (dont show the alerts)
   *
   * Translate(Función para agregar producto al carrito de compras).
   */
  async addCart(producto, umedida, clasificacion, cantidad, comentario, volverapedir: boolean = false) {

  }

  //Guarda un nuevo producto
  async saveNewProduct(producto, umedida, clasificacion, cantidad, comentario, volverapedir) {


    // Fin del agregado del nuevo producto.

  }

  // Actualiza un usuario cuando viene desde el carrito
  async UpdateProductByCart(clasificacion, cantidad, comentario, umedida) {
    // VIENE DEL CARRITO
    // validamos si hay cambios de valores de clasificaciones
    if (clasificacion.length > 0) {
      this.nuevoProducto.clasificacion = clasificacion;
      this.nuevoProducto.clasificacion.forEach((detalleClasificacion) => {
        this.nuevoProducto.producto.clasificacion.map((clasificacion) => {
          if (clasificacion.id == detalleClasificacion.id) {
            clasificacion.nombre = detalleClasificacion.opcion.id;
          }
        });
      });
    } else {
      this.nuevoProducto.clasificacion = this.producto.clasificacion;
    }
    // seteamos valores del producto
    this.nuevoProducto.cantidad = cantidad;
    this.nuevoProducto.comentario = comentario;
    this.nuevoProducto.precio = this.precio;
    this.nuevoProducto.umedidaStr = umedida;

    if (umedida) {
      // iteration for get ID of the unit of measurement.
      for (let IDMedida of this.producto.producto.unidadesMedida) {
        if (umedida == IDMedida.nombre) {
          this.nuevoProducto.umedida = IDMedida.id;
          this.nuevoProducto.umedidaStr = IDMedida.nombre;
        }
      }
    } else {
      // se asigna unidad de medida predefinida
      let umedida = this.producto.producto.unidadesMedida.filter((data) => data.default);
      this.nuevoProducto.umedida = umedida[0].id;
      this.nuevoProducto.umedidaStr = umedida[0].nombre;
    }

    // actualizamos el producto

    // dialog alert
    await this.api.presentAlert('Producto actualizado', '',
      'Producto actualizado correctamente!');
    this.misClasificaciones = [];
    // this.api.navegateAndDestroy('/cart');
    this.ngOnDestroy();

    // Fin del actualizado del producto
  }

  // Actualiza un usuario cuando viene desde el home
  async UpdateProductByHome(producto, clasificacion, cantidad, comentario, objectMedida, obtenerProductoCarrito, volverapedir) {
    producto.umedida = objectMedida[0].id;
    producto.umedidaStr = objectMedida[0].nombre;
    producto.clasificacion = clasificacion;
    // seteamos valores obtenidos del carrito.
    producto.cantidad = obtenerProductoCarrito.cantidad;
    producto.precio = obtenerProductoCarrito.precio;
    // dialog alert
    if (!volverapedir) {
      await this.api.presentAlert('Producto actualizado', '',
        'Producto actualizado correctamente!');
      this.misClasificaciones = [];
      // this.api.navegateAndDestroy('/cart');
      this.ngOnDestroy();
    }
    // Fin del actualizado del producto
  }

  // Valida que las opciones sean iguales
  validateOptions(clasificacionUser, clasificacionCart) {
    // arreglo de banderas booleanas de clasificaciones
    let banderasClasificaciones = [];
    // iteracción de la clasificacion del carrito
    for (let clasificacionDeCarrito of clasificacionCart) {
      // Iteracción de la clasificación del usuario
      for (let clasificacionDeUsuario of clasificacionUser) {
        // validamos que las opciones sean iguales
        if (clasificacionDeCarrito.id == clasificacionDeUsuario.id) {
          if (clasificacionDeCarrito.opcion.id == clasificacionDeUsuario.opcion.id) {
            banderasClasificaciones.push(true);
          } else {
            banderasClasificaciones.push(false);
          }
        }
      }
    }

    // buscamos si existe alguna clasificacion falsa (diferentes a las que ya existen).
    let filtroDeBanderas = banderasClasificaciones.filter((itemsFlags) => itemsFlags == false);
    // validamos que exista al menos 1 bandera falsa (alguna clasificación diferente).
    let banderaClasificacion = filtroDeBanderas.length > 0 ? false : true;
    // validamos que todas las clasificacion se cumplen.
    return banderaClasificacion;
  }

  async addFavorit(producto: any, favorito: number) {
    this.producto.isFavorit = !this.producto.isFavorit;
    producto.isFavorit = !producto.isFavorit;
    if (!favorito) {
      this.favoritS.create({
        idusuario: this.api.user.usuario.id,
        idproducto: producto.id
      });
    } else {
      this.favoritS.detele({
        idusuario: this.api.user.usuario.id,
        idproducto: producto.id
      });
    }
  }


  /**
 * Function for get data of the product.
 *
 * @param id is the identifier of the product.
 *
 */
  async getProductDetail(id, volverapedir = false, detalle: any = []) {
    const url = '/producto/detail/' + id;
    this.api.get(url).subscribe(
      async (data: any) => {
        if (data.data) {
          console.log(data.data);
          
          this.nuevoProducto = JSON.parse(JSON.stringify(data.data));
          this.producto = JSON.parse(JSON.stringify(data.data));
          // console.log(this.producto);
          let filtroUmedidaDefault;
          // validation for order again
          if (volverapedir) {
            this.typeView = 0;
            filtroUmedidaDefault = this.producto.producto.unidadesMedida.filter((umedidaItem: any) => umedidaItem.id == detalle.idunidadmed);
            if (!(filtroUmedidaDefault.length > 0)) {
              filtroUmedidaDefault = this.producto.producto.unidadesMedida.filter((umedidaItem: any) => umedidaItem.id == detalle.idunidadmed);
            }
            this.umedidaDefault = filtroUmedidaDefault[0].nombre;

            // load price of the product for first time.
            this.cantidadChange(Number(detalle.cantidad), this.umedidaDefault, 4);
            // select for first time unit of measurement of the product.
            this.updateUnitOfMeasurement(this.umedidaDefault);
            //detalle de pedido
            detalle.clasificacion.forEach((detalleClasificacion) => {
              // detalle de producto
              this.producto.producto.clasificacion.map((clasificacion) => {
                if (clasificacion.id == detalleClasificacion.clasificacionid) {
                  if (volverapedir) {
                    clasificacion.nombre = detalleClasificacion.opcionid;
                  }
                  this.updateClassification(clasificacion, detalleClasificacion.opcionid, true);
                }
              });
            });

            let volverApedir = true;
            // tslint:disable-next-line: max-line-length
            this.addCart(this.producto, detalle.producto.umedidastr, this.misClasificaciones, Number(detalle.cantidad), detalle.comentario, volverApedir);
            this.cantidad = 0;
          } else {
            let filtroUmedidaDefault = this.producto.producto.unidadesMedida.filter((umedidaItem: any) => umedidaItem.default == true);
            this.umedidaDefault = filtroUmedidaDefault[0].nombre;
            // load price of the product for first time.
            this.cantidadChange(1, this.umedidaDefault, 3);
            // select for first time unit of measurement of the product.
            this.updateUnitOfMeasurement(this.umedidaDefault);
            // init comment in the product.
            this.comentario = "";
            this.api.QuitarLoading();
          }
          // console.log(this.producto);
        } else {
          this.api.presentToast('No existe el producto');
          this.api.QuitarLoading();
        }
      },
      async (e) => {
        if (e.status === 401) {
          await this.api.user.updateToken();
        }
      }
    );
  }


}
