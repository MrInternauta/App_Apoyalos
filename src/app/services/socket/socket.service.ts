import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { PushService } from '../push/push.service';
import { ApiService } from '../api.service';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  pedido: any;
  public socketStatus = true;
  constructor(
    private socket: Socket,
    private push: PushService,
    private api: ApiService,
    private router: Router
  ) { }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function singleNotification
   * @description Show a single notification
   * @param {string} text Text to show
   * @param {any} data payload
   */
  checkstatus() {
    // si de conecta el servidor
    this.socket.on('connect', () => {
      this.socketStatus = true;
    });
    // si se desconecta
    this.socket.on('disconnect', () => {
      this.socketStatus = false;
    });
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function singleNotification
   * @description Show a single notification
   * @param {string} text Text to show
   * @param {any} data payload
   */
  listenPedido() {
    this.listen('UpdatePedido').subscribe((data: any) => {
      if (data) {
        const tipo = data.data.estado;
        let tipoS = '';
        console.log(tipo);
        switch (tipo) {
          case 0:
            tipoS = 'El pedido ha sido cancelado';
            break;
          case 1:
            tipoS = 'El pedido ha sido recibido';
            break;
          case 2:
            tipoS = 'El pedido esta en Proceso';
            break;
          case 3:
            tipoS = 'El pedido esta en Ruta de Entrega';
            break;
          case 4:
            tipoS = 'El pedido ha sido entregado';
            break;
          default:
            tipoS = 'El pedido ha sido cancelado';
        }

        this.pedido = data.data;
        this.push
          .singleNotification(tipoS, data)
          .on('click')
          .subscribe((dataNotification: any) => {
            this.getPedidoDetail(data.data);
          });

        this.api.MostrarAlert(
          'Pedido actualizado',
          tipoS,
          () => { },
          () => {
            this.getPedidoDetail(data.data);
          }
        );
      }
    });
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function singleNotification
   * @description Show a single notification
   * @param {string} text Text to show
   * @param {any} data payload
   */
  // Emitir todos los eventos de la app angular  evento: tipo, payload?:que vas a enviar , callback?: Function
  emit(evento: string, payload?: any, callback?) {
    this.socket.emit(evento, payload, callback); // hace uso de la class socket
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function singleNotification
   * @description Show a single notification
   * @param {string} text Text to show
   * @param {any} data payload
   */
  // escucha los eventos del servidor
  listen(evento: string) {
    // regresa  un observable del evento
    return this.socket.fromEvent(evento);
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function singleNotification
   * @description Show a single notification
   * @param {string} text Text to show
   * @param {any} data payload
   */
  async getPedidoDetail(pedido: any) {
    // NOTA : HAY UN DETALLE CON EL DIALOG DE LOADING NO SE CIERRA
    // await this.api.MostarLoading();
    const url = '/pedido/' + pedido.id;
    const navigationExtras: NavigationExtras = { state: { pedido } };
    this.router.navigate([url], navigationExtras);
  }

  /**
 * @author Felipe De Jesus 
 * @version 0.0.1
 * @function configUser
 * @description Configura al usuario sockets (manda el usuario de la sesion)
 */
  configUser() {
    this.socket.emit('configUser', this.api.user.usuario, (data) => {
      console.log(data);

    });
  }

}
