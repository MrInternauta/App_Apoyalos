import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
//import swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuario: any; // usuario
  token: string; // token del usuario

  constructor(
    public http: HttpClient,
    public router: Router,
    public alertController: AlertController,
  ) {
    this.CargarStorage();
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function CargarStorage
   * @description carga informacion del usuario a las variables del usuario
   */
  CargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function GuardarStorage
   * @description guarda el usuario en el localstorage
   * @param {string} id id del usuario
   * @param {string} token token del usuario
   * @param {any} usuario objeto del usuario
   */
  GuardarStorage(id: string, token: string, usuario: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function EstaLogueado
   * @description verifica si esta logueado
   */
  EstaLogueado() {
    return this.token.length > 5 ? true : false;
  }




  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function Logout
   * @description permite cerrar sesion
   */
  Logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    this.router.navigate(['/home']);
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function Login
   * @description permite iniciae sesion
   * @param {any} usuario objeto de tipo objeto
   */
  Login(usuario: any, recordar = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.correoele);
    } else {
      localStorage.removeItem('email');
    }
    // tslint:disable-next-line:align
    return this.http.post(environment.url + '/login', usuario).pipe(
      map((resp: any) => {
        console.log(resp);
        
        this.GuardarStorage(
          resp.data.usuario.idusuarios,
          resp.data.token,
          resp.data.usuario
        );
        return true;
      })
    );
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function RegistrarUsuario
   * @description permite registrar un usuario
   * @param {any} usuario objeto de tipo objeto
   */
  RegistrarUsuario(usuario: any) {
    // tslint:disable-next-line:align
    return this.http.post(environment.url + '/usuarios', usuario).pipe(
      map((data: any) => {
        console.log(data);
        
        return data.data.usuario;
      })
    );
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function updateToken
   * @description Si no es valido el token se cierra sesion
   */
  updateToken() {
    this.Logout();
    this.router.navigate(['/home']);
  }
}
