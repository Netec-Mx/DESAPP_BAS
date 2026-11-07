import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-contador',
  styleUrl: './contador.css',
  templateUrl: './contador.html',
})
export class Contador {
valor = 0;

  incrementar(): void { this.valor += 1; }

  decrementar(): void { this.valor -= 1; }

  reiniciar(): void { this.valor = 0; }

  ngOnInit(): void {
     console.log('Contador inicializado');
  }

  ngOnDestroy(): void {
     console.log('Contador destruido');
  }


}
