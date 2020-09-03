import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SubirarhivoService {
  timeStamp: any;
  linkPicture = '';
  // tslint:disable-next-line: deprecation
  constructor(private transfer: FileTransfer, private api: ApiService) { }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function subirImagen
   * @description prepara la petición para subir la imagen con la libreria FileTransfer
   * @param {any} archivo la imagen a subir
   */
  private subirImagen(archivo) {
    const url = environment.url + '/images/usuario/' + this.api.user.usuario.id;
    const options: FileUploadOptions = {
      fileKey: 'archivo',
      headers: {
        token: this.api.user.token
      }
    };
    const fileTrasfer: FileTransferObject = this.transfer.create();
    return fileTrasfer.upload(archivo, url, options);
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function uploadImage
   * @description permite subir una imagen
   * @param {any} imagen la imagen a subir
   */
  async uploadImage(imagen) {
    await this.api.MostarLoading();
    this
      .subirImagen(imagen)
      .then(async (data: any) => {
        if (data.responseCode ==  200) {
          let respuesta = JSON.parse(data.response);
          if (respuesta.status) {
            this.api.user.usuario.imagenurl = respuesta.data[0].imagenurl;
          }
          console.log(respuesta);
          this.api.presentToast('Imagen actualizada correctamente');
          await this.api.QuitarLoading();
          this.setLinkPicture(this.api.user.usuario.imagenurl);
        }
        
      })
      .catch(async (e: any) => {
        console.log(e);
        this.api.presentToast('Error al actualizar la imagen');
        await this.api.QuitarLoading();
      });
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function k
   * @description Obtiene la url de la imagen
   */
  public getLinkPicture() {
    if (this.timeStamp) {
      return this.linkPicture + '?' + this.timeStamp;
    }
    return this.linkPicture;
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function setLinkPicture
   * @description set el url de la imagen
   * @param {any} imagen la imagen a subir
   */
  public setLinkPicture(url: string) {
    this.linkPicture = url;
    this.timeStamp = new Date().getTime();
  }
}
