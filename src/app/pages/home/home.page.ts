import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CategoriaService } from 'src/app/services/service.index';
import { SocketService } from '../../services/socket/socket.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchData: any[] = [];
  searchParam = '';

  constructor
    (
      public categoriaS: CategoriaService,
      private router: Router,
      private socket: SocketService
    ) {
    this.getCategories();
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
    this.searchData = this.categoriaS.data.filter((categoria: any) => String(categoria.nombre).toLowerCase().includes($event) || String(categoria.descripcion).toLowerCase().includes($event));
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getCategories
   * @description async Function to get all categories
   * @returns Promise<any>
   */
  async getCategories(): Promise<any> {
    await this.categoriaS.getAll();
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function select_categoria
   * @description Function to navegate at the products pages of the category selected by the user
   * @param {any} categoria Category selected by the user
   * @returns {void} 
   */
  select_categoria(id, nombre): void {
    let categoria = {id, nombre}
    let navigationExtras: NavigationExtras = { state: { categoria } };
    this.router.navigate(['/productos/' + categoria.id], navigationExtras);
  }

}
