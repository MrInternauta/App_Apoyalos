import { Component, OnInit } from '@angular/core';
import { FavoritoService } from '../../services/favorito/favorito.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  constructor(public favoritS: FavoritoService) {
    this.getAll();
  }

  ngOnInit() {
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function quitar
   * @description Quita algun producto de favoritos
   * @param {any} product Objecto del producto a quitar
   */
  async quitar(product: any) {
    await this.favoritS.detele({
      idproducto: product.id,
      idusuario: this.favoritS.api.user.usuario.id
    });
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getAll
   * @description Obtiene todos productos favoritos
   */
  async getAll() {
    await this.favoritS.getAllByUserId();
  }

}
