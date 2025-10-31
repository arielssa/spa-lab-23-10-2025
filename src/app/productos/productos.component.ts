import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto  } from '../services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  nuevo: Producto = { id: '', nombre: '', costo: 0, precio: 0, valor: 0 };
  editando = false;
  cargando = false;
  displayedColumns: string[] = ['id', 'nombre', 'costo', 'precio', 'valor', 'acciones'];

  constructor(private productoSrv: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.productoSrv.listar().subscribe(data => {
      this.productos = data;
      this.cargando = false;
    });
  }

  guardar() {
    if (!this.nuevo.nombre || !this.nuevo.costo || !this.nuevo.precio) return alert('Complete los campos');

    if (this.nuevo.precio < 10 || this.nuevo.precio > 100) return alert('El precio está fuera de rango.');

    if (this.nuevo.id.match(/^[A-Z]\d+$/) === null) return alert('El ID debe tener el formato correcto ([Letra][Numeros])');

    if (this.nuevo.nombre.length < 5) return alert('El nombre del producto debe tener mínimo 5 caracteres.');

    if (this.nuevo.costo < 0) return alert('Ingrese un costo válido.');

    if (this.editando) {
      this.nuevo.valor = this.nuevo.precio - this.nuevo.costo;
      this.productoSrv.actualizar(this.nuevo).subscribe(() => {
        this.cargarProductos();
        this.cancelar();
      });
    } else {
      this.nuevo.valor = this.nuevo.precio - this.nuevo.costo;
      this.productoSrv.agregar(this.nuevo).subscribe(() => {
        this.cargarProductos();
        this.nuevo = { id: '', nombre: '', costo: 0, precio: 0, valor: 0 };
      });
    }
  }

  editar(producto: Producto) {
    this.nuevo = { ...producto };
    this.editando = true;
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar producto?')) return;
    this.productoSrv.eliminar(id).subscribe(() => this.cargarProductos());
  }

  cancelar() {
    this.editando = false;
    this.nuevo = { id: '', nombre: '', costo: 0, precio: 0, valor: 0 };
  }
}
