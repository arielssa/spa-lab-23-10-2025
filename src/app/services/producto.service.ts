import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Producto {
  id: string;
  nombre: string;
  costo: number;
  precio: number;
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [];

  constructor() {
    const raw = localStorage.getItem('productos');
    this.productos = raw ? JSON.parse(raw) : [
      { id: 'A001', nombre: 'Producto 1', costo: 100, precio: 150, valor: 50 },
      { id: 'A002', nombre: 'Producto 2', costo: 200, precio: 250, valor: 50 }
    ];
  }

  private guardar() {
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  listar() {
    return of(this.productos).pipe(delay(500));
  }

  agregar(producto: Producto) {
    //producto.id = Date.now();
    this.productos.push(producto);
    this.guardar();
    return of(producto).pipe(delay(400));
  }

  actualizar(producto: Producto) {
    const idx = this.productos.findIndex(p => p.id === producto.id);
    if (idx >= 0) this.productos[idx] = producto;
    this.guardar();
    return of(producto).pipe(delay(400));
  }

  eliminar(id: string) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.guardar();
    return of(true).pipe(delay(300));
  }
}
