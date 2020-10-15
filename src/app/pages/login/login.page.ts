import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  public user: string;
  public pass: string;
  public send = false;
  public loading: any;

  constructor(public router: Router, 
              public loadingController: LoadingController,
              private api: ApiService
    ) { }

  ngOnDestroy(): void {
    this.user = '';
    this.pass = '';
  }

  ngOnInit() {
  }
  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function login
   * @description allow signin with the email or username and the pass
   * @param {string} user user or email
   * @param {string} pass password
   */
  async login(user: string, pass: string) {
    await this.api.MostarLoading();
    this.send = true;
    console.log(user, pass);
    this.api.user.Login({ correo: String(user), contrasena: String(pass) }).subscribe(async (data) => 
    {
      this.router.navigateByUrl('/home');
      this.send = false;
      this.api.QuitarLoading();
    }, async (err) => {
       console.log(err);
       this.api.QuitarLoading();
       err.error =  err.error ? err.error : {};
       this.api.presentAlert('Error de inicio', '', err.error.message ? err.error.message : 'No existe conexión con el servidor.');
       this.send = false;
    });
  }


  /**
   * @author Felipe De Jesus 
   * @version 0.0.1
   * @function signupPage
   * @description Navega hacia lla pagina de registro
   */
  signupPage() {
    this.router.navigateByUrl('/signin');
  }
}
