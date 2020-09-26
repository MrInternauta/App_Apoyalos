import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CategoriaService } from 'src/app/services/service.index';
import { SocketService } from '../../services/socket/socket.service';
import { Socket } from 'ngx-socket-io';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  searchData: any[] = [];
  searchParam = '';
  data;
  clases = ['alimentos fadeInLeft', 'mobiliario fadeInRight', 'electronicos fadeInLeft', 'ropa fadeInRight', 'otros fadeInUp'];
  constructor
    (
      public categoriaS: CategoriaService,
      private router: Router,
      private socket: SocketService,
  ) {
  }
  ngOnInit(): void {
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
  getCategories() {
    this.categoriaS.getAll()
      .then((clasificaciones: any[]) => {
        let html = '';
        let idx = 0;
        clasificaciones.forEach(async (clasificacion, index) => {
          let imgUrl = await this.categoriaS.api.getImage(clasificacion.imagenurl, 'clasificacion');
          if (idx < this.clases.length - 1) {
            idx++;
          } else {
            idx = 0;
          }
          // 0 0/100% 100% no-repeat;
          html += `<div class="${this.clases[idx]} categorias" (click)="select_categoria(${clasificacion.idcategorias},'${clasificacion.nombre}')" style="grid-area: Gri${index + 1}; background: url(${imgUrl});"><p> ${clasificacion.nombre}</p> </div>`
          if (index == clasificaciones.length - 1) {      
            let catHtml = document.getElementById('clasificaciones');
            catHtml.innerHTML = html;
            //Set grids
            let body = document.getElementsByClassName('body')[0];
            //Dividir el total de cat/5
            let grids = ''
            grids += `
            "Gri${1} Gri${1} Gri${2} Gri${2}" 
            "Gri${1} Gri${1} Gri${3} Gri${3}"
            "Gri${1} Gri${1} Gri${3} Gri${3}"
            "Gri${1} Gri${1} Gri${3} Gri${3}"
            "Gri${4} Gri${4} Gri${3} Gri${3}"
            "Gri${5} Gri${5} Gri${5} Gri${5}"
            `
            if (clasificaciones.length >= 5) {
              let  iteracionesCats = Math.floor(clasificaciones.length / 5);              
              let num = 5
              for (let index = 1; index <= iteracionesCats; index++) {
                    grids += `
                  "Gri${1 + (num * index )} Gri${1 + (num * index )} Gri${2 + (num * index )} Gri${2 + (num * index )}" 
                  "Gri${1 + (num * index )} Gri${1 + (num * index )} Gri${3 + (num * index )} Gri${3 + (num * index )}"
                  "Gri${1 + (num * index )} Gri${1 + (num * index )} Gri${3 + (num * index )} Gri${3 + (num * index )}"
                  "Gri${1 + (num * index )} Gri${1 + (num * index )} Gri${3 + (num * index )} Gri${3 + (num * index )} "
                  "Gri${4 + (num * index )} Gri${4 + (num * index )} Gri${3 + (num * index )} Gri${3 + (num * index )}"
                  "Gri${5 + (num * index )} Gri${5 + (num * index )} Gri${5 + (num * index )} Gri${5 + (num * index )}"
                  `
              }
            }
            body.setAttribute('style', `
            grid-template-areas: ${grids}
            `)
            //En la primera poner del 1 al 5
            //Apartir de la segunda vuelta poner del el num * 5 

            // this.data = html
          }else {
            console.log("No", index , clasificaciones.length -1);
            
          } 
        });

      })
      .finally(() => {

      })
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function select_categoria
   * @description Function to navegate at the products pages of the category selected by the user
   * @param {any} categoria Category selected by the user
   * @returns {void} 
   */
  select_categoria(id, nombre = ''): void {
    console.log('Holaa');

    let categoria = { id, nombre }
    let navigationExtras: NavigationExtras = { state: { categoria } };
    this.router.navigate(['/productos/' + categoria.id], navigationExtras);
  }

}
