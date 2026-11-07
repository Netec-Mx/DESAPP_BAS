import { Component, signal } from '@angular/core';
import { Contador } from './contador/contador'

@Component({
  imports: [Contador],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  mostrarContador = true
}
