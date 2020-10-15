import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { ProductoService } from '../../services/producto/producto.service';

@Component({
  selector: 'app-donar',
  templateUrl: './donar.page.html',
  styleUrls: ['./donar.page.scss'],
})
export class DonarPage implements OnInit {
  nombre: string;
  descripcion: string;
  existencia: number;
  categoria: string;

  constructor(public categoriaS: CategoriaService,
              private productoS: ProductoService) { }

  async ngOnInit() {
    await this.categoriaS.getAll();
  }
  registrar(){
    console.log(this.nombre,  this.descripcion, this.existencia, this.categoria);
    if (!this.nombre || !this.descripcion || !this.existencia || !this.categoria) {
      return this.categoriaS.api.presentToast('Faltan rellenar algunos campos')
    }
    if (this.existencia == Math.E || this.existencia < 0) {
      return this.categoriaS.api.presentToast('No es valido el valor de la existencia ')
    }
    this.productoS.Create({
      nombre: this.nombre,
      descripcion: this.descripcion,
      existencia: this.existencia,
      idcategorias: this.categoria,
      id_usuario: this.categoriaS.api.user.usuario.idusuarios
    }).then((data)=> {
      this.nombre = ''
      this.descripcion = ''
      this.existencia = undefined
      this.categoria = ''
    })
    

  }

}
