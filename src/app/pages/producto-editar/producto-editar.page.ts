import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ApiService } from '../../services/api.service';
import { SubirarhivoService } from '../../services/subirarhivo/subirarhivo.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.page.html',
  styleUrls: ['./producto-editar.page.scss'],
})
export class ProductoEditarPage implements OnInit {
  @Input() producto: any;
  nombre: string;
  descripcion: string;
  existencia: number;
  categoria: string;
  imagenurl: string;

  constructor(private ruter: ActivatedRoute, public categoriaS: CategoriaService,
    public user: UsuarioService,
    private api: ApiService,
    private camera: Camera,
    public modalController: ModalController,
    public subirArchivo: SubirarhivoService,) { }

  async ngOnInit() {
    await this.categoriaS.getAll();
    const id = this.ruter.snapshot.params.id;
    if (this.producto) {
      this.nombre = this.producto.nombre;
      this.existencia = this.producto.existencia;
      this.descripcion = this.producto.descripcion;
      this.categoria = this.producto.categoria;
      this.imagenurl = this.producto.imagenurl;
    }


  }
  actualizar(){
    if (!this.nombre || !this.descripcion || !this.existencia || !this.categoria) {
      return this.categoriaS.api.presentToast('Faltan rellenar algunos campos')
    }
    if (this.existencia == Math.E || this.existencia < 0) {
      return this.categoriaS.api.presentToast('No es valido el valor de la existencia ')
    }

  }

    /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function changePic
   * @description Abre modal de opciones (Para actualizar la imagen)
   */
  changePic() {
    this.api.MostrarAlert(

      'Actualizar Fotografía',
      '¿Desde donde deseas seleccionar?',
      () => {
        this.openCamera(2);
      },
      () => {
        this.openCamera(1);
      },
      'Galeria',
      'Camara',
      "alerta-personalizada-aceptacept"
    );
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function openCamera
   * @description Abre la camara o galeria dependiendo de  que se le pase por parametro
   * @param {number} option Abrir la camara o la galeria (CAMARA = 1, GALERIA != 1)
   */
  openCamera(option: number = 1) {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: option == 1 ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.subirArchivo.uploadImage(imageData);
      },
      (err) => {
        console.log(err);
        this.api.presentToast('Error al abrir la camara');
      }
    );
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

}
