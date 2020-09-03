import { Router, ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from '../../services/api.service';
import { DireccionService } from '../../services/direccion/direccion.service';
import { AlertController } from '@ionic/angular';
import {
  NativeGeocoder,
} from '@ionic-native/native-geocoder/ngx';
declare var google: any;

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.page.html',
  styleUrls: ['./direccion.page.scss'],
})
export class DireccionPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  lat: string;
  long: string;
  autocomplete: { input: string };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  direccion: any = { latitud: 29.083165, longitud: -110.976592 };

  geocoder = new google.maps.Geocoder();

  constructor(
    public router: Router,
    private ruter: ActivatedRoute,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private api: ApiService,
    private direccionService: DireccionService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.getDirectionDetail();
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function getDirectionDetail
   * @description Function for get direction detail
   */
  async getDirectionDetail() {
    if (this.router.getCurrentNavigation().extras.state != null) {
      const direccion = this.router.getCurrentNavigation().extras.state
        .direccion;
      this.direccion = direccion;
      this.getDirecctionByLocation(direccion.latitud, direccion.longitud);
    } else {
      // Si no se paso nada por parametro que obtenga la ubicación actual
      this.getCurrentLocation();
    }
  }
  /**
   * Function for get current position of the user.
   */
  async getCurrentLocation() {
    // OBTENEMOS LAS COORDENADAS DESDE EL TELEFONO.
    await this.api.MostarLoading();
    this.geolocation
      .getCurrentPosition()
      .then(async (resp) => {
        this.getDirecctionByLocation(
          resp.coords.latitude,
          resp.coords.longitude
        );
        await this.api.QuitarLoading();
      })
      .catch(async (error) => {
        await this.api.QuitarLoading();
        this.api.presentToast('No se pudo obtener la localización actual.');
      });
  }

  // FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  async SelectSearchResult(item) {
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];
    await this.api.MostarLoading();
    this.geocoder.geocode({ placeId: item.place_id }, async (responses, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        const lat = responses[0].geometry.location.lat();
        const lng = responses[0].geometry.location.lng();
        this.direccion = {
          latitud: lat,
          longitud: lng,
          direccion: item,
        };
        console.log(this.direccion);
      } else {
        this.api.presentToast('No se pudo obtener la dirección, intenta de nuevo.');
      }
      await this.api.QuitarLoading();
    }, async (e) => {
      this.api.presentToast('No se pudo obtener la dirección, intenta de nuevo.');
      await this.api.QuitarLoading();
    });
  }

  // LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }
  // AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    const sw = new google.maps.LatLng(29.088925, -110.972252);
    const ne = new google.maps.LatLng(29.088925, -110.972252);

    const boundsCity = new google.maps.LatLngBounds(sw, ne);
    this.GoogleAutocomplete.getPlacePredictions({
      input: this.autocomplete.input,
      bounds: boundsCity,
      radius: 10000,
      componentRestrictions: {
        country: 'mx',
      },
    },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          if (predictions === null) {
            return;
          }
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }
    );
  }

  // Si le dan click al mapa
  clickMap(event) {
    this.getDirecctionByLocation(event.coords.lat, event.coords.lng);
  }

  /**
   * Function for get address by location of the user.
   * @param latitud is the coordinate by location.
   * @param longitud is the coordinate by location.
   */
  getDirecctionByLocation(latitud: number, longitud: number) {
    var latLng = new google.maps.LatLng(latitud, longitud);

    this.geocoder.geocode({ location: latLng }, (directionResponse, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (directionResponse[0] != null) {
          console.log(directionResponse[0]);
          this.direccion = {
            direccion: directionResponse[0]
          };
          this.direccion.latitud = latitud;
          this.direccion.longitud = longitud;
          this.autocomplete.input = directionResponse[0].formatted_address;
        } else {
          this.api.presentToast('No se pudo obtener la dirección, intenta de nuevo.');
        }
      }
    }, (e) => {
      console.log(e);
      this.api.presentToast('No se pudo obtener la dirección, intenta de nuevo.');
    });
  }

  guardar() {
    // Valida que exista una direcion
    if (this.direccion.direccion === undefined) {
      return this.api.presentToast('No existe una dirección');
    }
    // Direccion completa (descripcion)
    // tslint:disable-next-line: max-line-length
    const mensaje = this.direccion.direccion.formatted_address
      ? this.direccion.direccion.formatted_address
      : this.direccion.direccion.description
        ? this.direccion.direccion.description
        : '';
    let nombreReferencia = {
      descripcion: '',
      referencia: ''
    };
    // Actualiza una direccion
    if (this.direccion.id) {
      nombreReferencia.descripcion = this.direccion.descripcion;
      nombreReferencia.referencia = this.direccion.referencia;
      this.InformacionAlert('¿Está seguro de actualizar esta dirección?', mensaje, nombreReferencia, async (data) => {
        this.validateDirection().then(async direccion => {
          direccion['id'] = this.direccion.id;
          direccion['descripcion'] = data.descripcion;
          direccion['referencia'] = data.referencia;
          // Servicio que actualiza un nuevo pedido
          await this.direccionService.update(direccion);
          // this.direccion = {  latitud: 29.083165, longitud: -110.976592 };
        })
          .catch(e => {
            return this.api.presentToast(e);
          })

      });
    } else {
      // Objecto direccion a guardar
      this.InformacionAlert('¿Está seguro de guardar esta dirección?', mensaje, nombreReferencia, async (data) => {
        this.validateDirection().then(async direccion => {
          console.log(direccion);
          direccion['descripcion'] = data.descripcion;
          direccion['referencia'] = data.referencia;
          // Servicio que crea un nuevo pedido
          await this.direccionService.create(direccion);
          this.direccion = { latitud: 29.083165, longitud: -110.976592 };

          console.log(this.direccion);
        })
          .catch(e => {
            return this.api.presentToast(e);
          })
      });
    }
  }
  async InformacionAlert(header: string, mensaje: string, nombreReferencia: any, callback: any) {
    const alert = await this.alertController.create({
      cssClass: 'alerta-personalizada-aceptcancel',
      header,
      subHeader: mensaje,
      inputs: [
        {
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción',
          value: nombreReferencia.descripcion
        },
        {
          name: 'referencia',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Referencias',
          value: nombreReferencia.referencia
        },
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
          text: 'Guardar',
          cssClass: 'success',
          handler: (data) => {
            if (data.descripcion === '') {
              return this.api.presentToast('Debe ingresar la descripción');
            }
            callback(data);
          },
        },
      ],
    });

    await alert.present();
  }
  validateDirection() {
    return new Promise((resolve, reject) => {
      // Objecto direccion a guardar
      let direccion = {
        idusuario: this.api.user.usuario.id,
        descripcion: '',
        latitud: this.direccion.latitud,
        longitud: this.direccion.longitud,
        defaultDireccion: false,
        calle: '',
        numero: '',
        colonia: '',
        municipio: '',
        entidadfed: 'Sonora',
        pais: 'México',
        referencia: '',
      };

      // FORMA DE SETEAR LOS VALORES CUANDO SE OBTIENE LA DIRECCION DESDE EL GPS O MAPA
      if (this.direccion.direccion.address_components) {
        console.log(this.direccion.direccion.address_component);

        if (Number(this.direccion.direccion.address_components[0].short_name)) {
          direccion.calle = this.direccion.direccion.address_components[1].short_name;
          direccion.numero = this.direccion.direccion.address_components[0].short_name;
          direccion.colonia = this.direccion.direccion.address_components[2].short_name;
          direccion.municipio = this.direccion.direccion.address_components[3].short_name;
          direccion.entidadfed = this.direccion.direccion.address_components[4].short_name;
        } else {
          direccion.calle = this.direccion.direccion.address_components[0].short_name;
          direccion.numero = '';
          direccion.colonia = this.direccion.direccion.address_components[1].short_name;
          direccion.municipio = this.direccion.direccion.address_components[2].short_name;
          direccion.entidadfed = this.direccion.direccion.address_components[3].short_name;
        }

      } else if (this.direccion.direccion.terms) {
        console.log(this.direccion.direccion.terms);

        // FORMA DE SETEAR LOS VALORES CUANDO SE OBTIENE LA DIRECCION DESDE EL BUSCADOR
        // Valida que ingrese una direccion valida
        if (this.direccion.direccion.terms.length <= 3) {
          reject('Debe ingresar una dirección válida')
        }
        // Setea los valores del la direccion al objecto direccion
        if (this.direccion.direccion.terms.length >= 5) {
          if (Number(this.direccion.direccion.terms[1].value)) {
            direccion.calle = this.direccion.direccion.terms[0].value;
            direccion.numero = this.direccion.direccion.terms[1].value;
            direccion.colonia = this.direccion.direccion.terms[2].value;
            direccion.municipio = this.direccion.direccion.terms[3].value;
            direccion.entidadfed = this.direccion.direccion.terms[4].value;
          } else {
            direccion.calle = this.direccion.direccion.terms[0].value;
            direccion.numero = '';
            direccion.colonia = this.direccion.direccion.terms[1].value;
            direccion.municipio = this.direccion.direccion.terms[3].value;
            direccion.entidadfed = this.direccion.direccion.terms[4].value;
          }
        } else if (this.direccion.direccion.terms.length <= 4) {
          direccion.calle = this.direccion.direccion.terms[0].value;
          direccion.numero = this.direccion.direccion.terms[1].value;
          direccion.colonia = '';
          direccion.municipio = 'Hermosillo';
          direccion.entidadfed = this.direccion.direccion.terms[2].value;
        }
      }
      let distancia = this.direccionService.calcular_distancia(this.direccionService.direccionCentral.latitud, this.direccionService.direccionCentral.longitud, direccion.latitud, direccion.longitud);
      console.log(distancia);

      // limite de distancia de entrega
      if (Number(distancia) <= 12) {
        resolve(direccion);
        return direccion;
      } else {
        reject('El servicio solo esta disponible en Hermosillo.');
      }
    });

  }

}
