import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() titulo;
  @Input() subMenu;
  @Input() modal;

  constructor(    private user: UsuarioService,
                  public modalController: ModalController,
                  private menu: MenuController
                  ) { }

  ngOnInit() {}

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function salir
   * @description Cierra la sesión actual
   */
  salir() {
    this.user.Logout();
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function dismiss
   * @description Cierra el modal actual en el que se encuentra
   */
  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

    /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function openFirst
   * @description Abrir menu
   */
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

}
