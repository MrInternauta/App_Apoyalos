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
    return this.getImage(img, tipo)
  }

  getImage(img: string , tipo: string = 'usuario'){
    return new Promise((resolve, reject) => {
      // La peticion regresa una img y se pasa a una url temporal para poder ser usada
      this.api.GetImagen(img, tipo).subscribe((value: any) => {
        const reader = new FileReader();
        const UrlImgTemp = reader.readAsDataURL(value);
        reader.onloadend = () => {
         let imagenTemp = reader.result;
         resolve(imagenTemp)
        };

      }, (value) => {
        console.log(value);
        
        resolve('../assets/theme/images/no-image.jpg');
      })
    })

  }

}
