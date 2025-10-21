export interface Paciente {
  id: number;
  tipoDocumentoId: number;
  numeroDocumento: string;
  nombre: string;
  nacimiento: string;
  correo: string;
  generoId: number;
  direccion?: string | null;
  telefono?: string | null;
  activo: boolean;
  creado?: string;
  actualizado?: string | null;
}

export type PacienteCreate = Omit<Paciente, 'id' | 'creado' | 'actualizado'>;
export type PacienteUpdate = PacienteCreate;
