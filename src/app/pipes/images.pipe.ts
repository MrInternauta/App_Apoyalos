import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from '../services/usuario/usuario.service';

@Pipe({
  name: 'images'
})
export class ImagesPipe implements PipeTransform {
  constructor(private _Usuario: UsuarioService){}

              // productos - perfil
  transform(img: string , tipo: string = 'productos'): any {
    let url = environment.urlWeb + '/assets/img/';
    if ( !img ) {
      return url + `${tipo}/xxx?token=${this._Usuario.token}`;
    }
    if (img.indexOf('https') >= 0 || img.indexOf('http') >= 0) {
      return img;
    }
    else {
      let myurl =  `${url}${tipo}/${img}`;
      return myurl;
    }
  }

}
