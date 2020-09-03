import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesPipe } from './images.pipe';



@NgModule({
  declarations: [
    ImagesPipe
  ],
  imports: [
    CommonModule
  ], exports: [
    ImagesPipe
  ]
})
export class PipesModule { }
