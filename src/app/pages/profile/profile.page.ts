import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SubirarhivoService } from '../../services/subirarhivo/subirarhivo.service';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
declare var window: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  img: any;

  constructor(
    public user: UsuarioService,
    private api: ApiService,
    private camera: Camera,
    public subirArchivo: SubirarhivoService,
    public actionSheetController: ActionSheetController,
    private router: Router
  ) { }

  ngOnInit() { }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function editProfile
   * @description Muestra Alerta y permite editar perfil
   */
  editProfile() {
    this.presentAlertPrompt();
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function presentAlertPrompt
   * @description Muestra Alerta (con todos los campos y con los valores actuales), permite editar perfil y actualizar la información
   */
  async presentAlertPrompt() {
    const alert = await this.user.alertController.create({
      header: 'Editar Información',
      cssClass: 'alerta-personalizada-aceptcancel',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: this.user.usuario.nombre,
          placeholder: 'Nombre',
        },
        {
          name: 'apellidopat',
          type: 'text',
          value: this.user.usuario.apellidopat,
          placeholder: 'Apellido Paterno',
        },
        {
          name: 'apellidomat',
          type: 'text',
          value: this.user.usuario.apellidomat,
          placeholder: 'Apellido Materno',
        },
        {
          name: 'telefono',
          type: 'tel',
          value: this.user.usuario.telefono,
          placeholder: 'Telefono',
        },
        {
          name: 'fechanac',
          type: 'date',
          placeholder: 'Fecha de nacimiento',
          value: this.formatDate(new Date(this.user.usuario.fechanac) + ''),
        },
        // {
        //   label: 'Sexo',
        //   name: 'sexo',
        //   type: 'radio',
        //   value: 'sexo',
        //   placeholder: 'Telefono',
        // },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Actualizar',
          cssClass: 'success',
          handler: (data: any) => {
            // data.sexo = 'm';
            this.ActualizarUsuario(data).subscribe(
              (data: any) => {
                console.log(data.data[0]);
                this.user.GuardarStorage(
                  data.data[0].id,
                  this.user.token,
                  data.data[0]
                );
                this.api.presentToast('Usuario actualizado');
                this.api.QuitarLoading();
                return true;
              },
              (err: any) => {
                this.user.updateToken();
                this.api.QuitarLoading();
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function ActualizarUsuario
   * @description Realizar la petición  al API y permite actualizar un usuario 
   * @param {any} usuario objecto del usuario a actualizar
   * @returns {Promise<any>} return una peticion (suscriber)
   */
  ActualizarUsuario(usuario: any) {
    this.api.MostarLoading();
    const headers = new HttpHeaders({
      token: this.user.token,
    });
    let datosActualizar = {
      // Poner los campos a actualizar (valida los campos)
      nombre: usuario.nombre === '' ? usuario.nombre : usuario.nombre,
      apellidopat:
        usuario.apellidopat === ''
          ? usuario.apellidopat
          : usuario.apellidopat,
      apellidomat:
        usuario.apellidomat === ''
          ? usuario.apellidomat
          : usuario.apellidomat,
      sexo: usuario.sexo === '' ? usuario.sexo : usuario.sexo,
      telefono: usuario.telefono === '' ? usuario.telefono : usuario.telefono,
      fechanac: usuario.fechanac === '' ? usuario.fechanac : usuario.fechanac,
    };
    console.log(datosActualizar);

    return this.user.http.put(
      environment.url + '/usuarios/' + this.user.usuario.id,
      datosActualizar,
      {
        headers,
      }
    );
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
   * @function getPedidos
   * @description Get all pedidos by userId
   * @returns {Promise<any>} return a Object or  a false value
   */
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Configuración',
      cssClass: 'alerta-personalizada',
      buttons: [{
        cssClass: 'success',
        text: 'Editar Información',
        icon: 'create-outline',
        handler: () => {
          this.presentAlertPrompt();
        }
      }, {
        cssClass: 'success',
        text: 'Actualizar Fotografía',
        icon: 'camera-reverse-outline',
        handler: () => {
          this.changePic();
        }
      },
      {
        cssClass: 'success',
        text: 'Mis Direcciones',
        icon: 'location-outline',
        handler: () => {
          this.api.navegateAndDestroy('/direcciones');
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        cssClass: 'danger',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  /**
 * @alias formatDateString
 * @description Quita caracteres especiales de un string de fecha y devuelve un tipo de dato fecha
 * @param {String} date String de fecha en /Date(12342142)/
 * @returns {Date} Una fecha tipo Mon Feb 20 2017 00:00:00 GMT-0600 (hora estándar central) en caso de que el string sea correcto
 * @returns {String} 'INDEFINIDO' en caso que date sea null o undefined
* @example util.formatDateString('/Date(12342142)/')
 */
  formatDateString(date: string) {
    console.log(date);

    let fecha;
    fecha = 'IDEFINIDO'
    if (date !== null) {
      fecha = date.replace('/Date(', '');
      fecha = fecha.replace(')/', '');
      fecha = new Date(Number(fecha));
    }
    return fecha;
  }

  /**
  * @alias formatDate
  * @description Pasa de un formato largo de fecha a '2019-04-06'
  * @param {Date} date una fecha en formato 'Mon Feb 20 2017 00:00:00 GMT-0600 (hora estándar central)'
  * @returns {String} Una fecha en formato '2019-04-06' en caso de que la fecha sea correcta
  * @returns {String} 'INDEFINIDO' en caso que date sea null o undefined
  * @example util.formatDate(Mon Feb 20 2017 00:00:00 GMT-0600 (hora estándar central))
  */
  formatDate(date) {
    if (date === "INDEFINIDO") return "INDEFINIDO"
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

}
