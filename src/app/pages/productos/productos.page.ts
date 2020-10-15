import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/service.index';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  searchData: any[] = [];
  searchParam = '';
  categoria: any = [];
  productos: any[];
  constructor(private ruter: ActivatedRoute,
    private api: ApiService,
    public productS: ProductoService,
    private router: Router,
    public toastController: ToastController) { }

  ngOnInit() {
    this.getCategoriaOwn();
    const id = this.ruter.snapshot.params.id;
    this.getProducts(id);
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function search
   * @description Function to search item by name or description
   * @param {string} $event keyworld to find a item
   * @returns {void} 
   */
  search($event) {
    $event = String($event).toLowerCase();
    // tslint:disable-next-line: max-line-length
    this.searchData = this.productS.data.filter((categoria: any) => String(categoria.nombre).toLowerCase().includes($event) || String(categoria.descripcion).toLowerCase().includes($event));
  }


  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getCategoriaOwn
   * @description Function for get information (categoria) from the homePage  (navegation)
   * @returns {void} 
   */
  getCategoriaOwn(): void {
    if (this.router.getCurrentNavigation().extras.state != null) {
      this.ruter.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.categoria = this.router.getCurrentNavigation().extras.state.categoria;
          console.log(this.categoria);
        }
      });
    } else {
      this.categoria.nombre = 'Productos';
    }
  }


  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getProducts
   * @description async Function to get all product from a category
   * @param {string} CategoryId Category selected by the user
   * @returns Promise<any>
   */
  async getProducts(CategoryId: string): Promise<any> {
    await this.productS.getAllByCategoriaId(CategoryId);
  }


  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function selecccionar_producto
   * @description Function to navegate at the product pages
   * @param {any} producto Producto selected by the user
   * @returns {void} 
   */
  selecccionar_producto(producto: any): void {
    console.log(producto);
    
  }

}
