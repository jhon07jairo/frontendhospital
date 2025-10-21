import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacientesService } from './pacientes.service';
import { Paciente, PacienteCreate } from './paciente.model';

interface LookupItem { id: number; name: string; }

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.css']
})
export class PacientesListComponent implements OnInit {
  private readonly svc = inject(PacientesService);

  pacientes = signal<Paciente[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Catálogos de equivalencias
  readonly tipoDocumentos: LookupItem[] = [
    { id: 1, name: 'CC' },
    { id: 2, name: 'TI' },
    { id: 3, name: 'CE' },
    { id: 4, name: 'PA' }
  ];
  readonly generos: LookupItem[] = [
    { id: 1, name: 'Masculino' },
    { id: 2, name: 'Femenino' },
    { id: 3, name: 'Otro' }
  ];


  editingId = signal<number | null>(null);
  form = signal<PacienteCreate>(this.emptyForm());
  formTitle = computed(() => (this.editingId() ? 'Editar Paciente' : 'Nuevo Paciente'));

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.svc.getAll().subscribe({
      next: (list) => {
        this.pacientes.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudo cargar la lista de pacientes');
        this.loading.set(false);
      }
    });
  }

  startCreate() {
    this.editingId.set(null);
    this.form.set(this.emptyForm());
  }

  startEdit(p: Paciente) {
    this.editingId.set(p.id);
    this.form.set({
      tipoDocumentoId: p.tipoDocumentoId,
      numeroDocumento: p.numeroDocumento,
      nombre: p.nombre,
      nacimiento: p.nacimiento?.substring(0, 10),
      correo: p.correo,
      generoId: p.generoId,
      direccion: p.direccion ?? '',
      telefono: p.telefono ?? '',
      activo: p.activo
    });
  }

  cancelEdit() {
    this.startCreate();
  }

  submit() {
    const id = this.editingId();
    const payload = this.form();

    if (!this.isValid(payload)) {
      this.error.set('Completa los campos requeridos.');
      return;
    }

    if (id == null) {
      this.svc.create(payload).subscribe({
        next: () => {
          this.load();
          this.startCreate();
        },
        error: (err) => this.error.set('No se pudo crear el paciente')
      });
    } else {
      this.svc.update(id, payload).subscribe({
        next: () => {
          this.load();
          this.startCreate();
        },
        error: (err) => this.error.set('No se pudo actualizar el paciente')
      });
    }
  }

  remove(p: Paciente) {
    if (!confirm(`¿Eliminar paciente ${p.nombre}?`)) return;
    this.svc.delete(p.id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('No se pudo eliminar el paciente')
    });
  }

  displayTipoDocumento(id: number) {
    const item = this.tipoDocumentos.find(t => t.id === id);
    return item ? `${id} - ${item.name}` : `${id}`;
  }

  displayGenero(id: number) {
    const item = this.generos.find(g => g.id === id);
    return item ? `${id} ${item.name}` : `${id}`;
  }

  private emptyForm(): PacienteCreate {
    return {
      tipoDocumentoId: 1,
      numeroDocumento: '',
      nombre: '',
      nacimiento: new Date().toISOString().substring(0, 10),
      correo: '',
      generoId: 1,
      direccion: '',
      telefono: '',
      activo: true
    };
  }

  private isValid(f: PacienteCreate) {
    return (
      !!f.tipoDocumentoId &&
      !!f.numeroDocumento &&
      !!f.nombre &&
      !!f.nacimiento &&
      !!f.correo &&
      !!f.generoId
    );
  }
}
