import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto/producto.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  constructor(
    private ruter: ActivatedRoute,
    public router: Router,
    public productoService: ProductoService,
    public api: ApiService) {
  }

  ngOnInit() {
    this.getProductDetailOfCart();
  }

  // This event is for destroy variables when, use the navigation route.
  ngOnDestroy() {
    this.productoService.nuevoProducto = null;
    this.productoService.producto = null;
  }

  /**
   * Function for get product detail
   *
   * Translate (Función para obtener el detalle de producto).
   */
  getProductDetailOfCart() {
    //Validate if get values from cart page or product page.    
    if (this.router.getCurrentNavigation().extras.state != null) {
      // cart page
      this.productoService.typeView = 1;
      this.ruter.queryParams.subscribe((params) => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.productoService.producto = this.router.getCurrentNavigation().extras.state;
          // set amount of the product from cart page.
          // Translate(Setear cantidad del producto desde la página del carrito).
          let values = {
            target: { value: this.productoService.producto.cantidad }
          }

          this.productoService.cantidadChange(values, this.productoService.producto.UnidaM, 2);
          // update unit of measurement.
          this.productoService.updateUnitOfMeasurement(this.productoService.producto.umedidaStr);
          // get comment from cart shopping.
          this.productoService.comentario = this.productoService.producto.comentario;
          // get classifications of the product.
          for (let listaDeClasificaciones of this.productoService.producto.clasificacion) {
            this.productoService.updateClassification(listaDeClasificaciones, listaDeClasificaciones.opcion.id);
          }

          this.productoService.nuevoProducto = JSON.parse(JSON.stringify(this.productoService.producto));
          this.api.QuitarLoading();
        }
      });
    } else {
      // menu product page
      this.productoService.typeView = 0;
      const idProducto = this.ruter.snapshot.params.id;
      this.productoService.getProductDetail(idProducto);
    }
  }

  /**
   * Function for get data of the product.
   *
   * @param id is the identifier of the product.
   *
   */
  async getProductDetail(id) {
    this.productoService.getProductDetail(id);
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
    this.productoService.cantidadChange(value, umedida, typeCalculateAmount);
  }

  /**
   * Function for update the unit of measurement of the product.
   *
   * @param measurement is the unit of measurement selected.
   *
   * Translate(Función para cambiar la unidad de medida del producto).
   */
  updateUnitOfMeasurement(nombreMedida) {
    this.productoService.updateUnitOfMeasurement(nombreMedida);
  }

  /**
   * Function for update the classification of the product.
   *
   * @param classification is the classification selected.
   *
   * Translate(Función para cambiar la clasificación del producto).
   */
  updateClassification(Classification, opcion) {
    this.productoService.updateClassification(Classification, opcion);
  }

  /**
   * Function for add product to cart of shopping.
   *
   * @param producto
   * @param umedida
   * @param clasificacion
   * @param cantidad
   * @param comentario
   *
   * Translate(Función para agregar producto al carrito de compras).
   */
  async addCart(producto, umedida, clasificacion, cantidad, comentario) {
    this.productoService.addCart(producto, umedida, clasificacion, cantidad, comentario);
  }

  async addFavorit(producto: any, favorito: number) {
    this.productoService.addFavorit(producto, favorito);
  }
}
