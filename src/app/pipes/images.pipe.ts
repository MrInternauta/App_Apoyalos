import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from '../services/usuario/usuario.service';
import { ApiService } from '../services/api.service';

@Pipe({
  name: 'images'
})
export class ImagesPipe implements PipeTransform {
  constructor(private _Usuario: UsuarioService, private api: ApiService){}

              // productos - perfil
  transform(img: string , tipo: string = 'usuario'): any {
    return this.api.getImage(img, tipo)
  }


}
