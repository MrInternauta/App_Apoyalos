import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  nombre: string;
  apellidopat: string;
  apellidomat: string;
  email: string;
  pass: string;
  pass2: string;
  usuario: string;
  telefono: string;
  fechanac: string;
  sexo: string;
  mensaje = ''

  constructor(private api: ApiService,
              public router: Router) {}

  ngOnInit() {}
  async registrar() {
    this.mensaje  = '';
    await this.api.MostarLoading();
    const user = {
      nombre: !this.nombre ? '' : this.nombre,  // 32
      apellidopat: !this.apellidopat ? '' : this.apellidopat, // 32
      apellidomat: !this.apellidomat ? '' : this.apellidomat, // 32
      correo: !this.email ? '' : this.email, //128
      contrasena: !this.pass ? '' : this.pass,
      pass2: !this.pass2 ? '' : this.pass2,
      curp: !this.usuario ? '' : this.usuario, // 16
      telefono: !this.telefono ? '' : this.telefono, // 10
      fechanac: !this.fechanac ? '' : this.fechanac,
      genero: !this.sexo ? '' : this.sexo,
    };
    this.validarCampos(user);
    if (this.mensaje !== '') {
      return;
    }
    this.api.user.RegistrarUsuario(user).subscribe(
      async (data) => {
        this.api.presentAlert(
          'Registro correcto',
          'Usuario: ' + user.curp + ' registrado correctamente',
          'Hemos enviado un correo electrónico de activación.'
        );
        this.clearInputs();
        await this.api.QuitarLoading();
        this.router.navigateByUrl('/login');
        console.log('Registro correcto', data);
      },
       async (err) => {
        this.api.presentAlert('Error de registro', '', err.error ? err.error.message : '');
        await this.api.QuitarLoading();
        console.log('Registro incorrecto', err);
      }
    );
  }

  async validarCampos(user: any) {
    this.mensaje  = '';
    if (user.contrasena !== user.pass2) {
      this.mensaje = 'Las contraseñas no coiciden.';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    }
    if (!user.curp) {
      this.mensaje += '\nFalta ingresar un usuario.';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    } else {
      if (user.curp.length > 16) {
        this.mensaje += '\nEl campo "Usuario" es muy grande.';
        await this.api.QuitarLoading();
        return this.api.presentToast(this.mensaje);
      }
    }

    if (!user.nombre) {
      this.mensaje += '\nFalta ingresar un nombre.';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    } else {
      if (user.nombre.length > 32) {
        this.mensaje += '\nEl campo "Nombre" es muy grande.';
        await this.api.QuitarLoading();
        return this.api.presentToast(this.mensaje);
      }
    }
    if (!user.apellidopat) {
      this.mensaje += '\nFalta ingresar un apellido paterno.';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    } else {
      if (user.apellidopat.length > 32) {
        this.mensaje += '\nEl campo "Apellido paterno" es muy grande.';
        await this.api.QuitarLoading();
        return this.api.presentToast(this.mensaje);
      }
    }
    if (!user.apellidomat) {
      this.mensaje += '\nFalta ingresar un apellido materno.';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    } else {
      if (user.apellidomat.length > 32) {
        this.mensaje += '\nEl campo "Apellido materno" es muy grande.';
        await this.api.QuitarLoading();
        return this.api.presentToast(this.mensaje);
      }
    }

    if (!user.correo) {
      this.mensaje += '\nFalta ingresar un email.';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    } else {
      if (user.correo.length > 128) {
        this.mensaje += '\nEl campo "Email" es muy grande.';
        await this.api.QuitarLoading();
        return this.api.presentToast(this.mensaje);
      }
    }
    if (!user.contrasena) {
      this.mensaje += '\nFalta ingresar una contraseña.';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    } else {
      if (user.contrasena.length < 6) {
        this.mensaje += '\nLa contraseña debe tener 6 carácteres como mínimo';
        await this.api.QuitarLoading();
        return this.api.presentToast(this.mensaje);
      }
    }

    if (!user.fechanac) {
      this.mensaje += '\nFalta ingresar la fecha de nacimiento';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    }
    if (!user.telefono) {
      this.mensaje += '\nFalta ingresar el telefono';
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    }else {
      if (user.telefono.length != 10) {
        this.mensaje += '\nEl telefono debe tener 10 digitos';
        await this.api.QuitarLoading();
        return this.api.presentToast(this.mensaje);
      }
    }

    if (this.mensaje !== '') {
      this.mensaje = this.mensaje;
      await this.api.QuitarLoading();
      return this.api.presentToast(this.mensaje);
    }
  }

  clearInputs() {
    this.nombre = '';
    this.apellidomat = '';
    this.apellidopat = '';
    this.email = '';
    this.pass = '';
    this.pass2 = '';
    this.usuario = '';
    this.telefono = '';
    this.fechanac = '';
    this.sexo = '';
  }
}
