import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UsuarioService } from './services/usuario/usuario.service';
import { NavController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { SubirarhivoService } from './services/subirarhivo/subirarhivo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  optionMenu = [{
    name: 'Home',
    icon: 'home-outline',
    url: '/home'
  },
  {
    name: 'Donar',
    icon: 'heart-outline',
    url: '/donar'
  },

]  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public user: UsuarioService,
    private navController: NavController,
    private api: ApiService,
    private subir: SubirarhivoService,
  ) {

    this.initializeApp();

  }
  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.backgroundColorByHexString('#3B78A1');
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        if (this.platform.is('android') || this.platform.is('ios')) {
          await this.api.verifyNetwork();
          this.inicializeServices();
        }
      } else {
        this.inicializeServices();
      }

    });
  }

  async inicializeServices() {
    if (this.user.EstaLogueado()) {
      await this.subir.setLinkPicture(this.user.usuario.imagenurl);
    }
  }


  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function changePage
   * @description Cambia la dirección por url
   * @param {string} pageUrl url de la pagina
   */
  changePage(pageUrl: string) {
    this.api.navegateAndDestroy(pageUrl);
  }

  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function salir
   * @description Elimina la sesión del usuario y redirige al login
   */
  salir() {
    this.api.MostrarAlert('Cerrar sesión', '¿Está seguro de cerrar sesión?', () => { }, () => {
      this.user.Logout();
      this.navController.navigateRoot('/login');
      window.location.reload();
    });
  }

}
