export interface Inmueble {
  baja: boolean
  baldio_country: boolean
  baldio_sucio: boolean
  causa_exencion: string
  cedulon_digital: number
  celular: string
  circunscripcion: number
  ciudad_dom_esp: string
  clave_pago: string
  clave_pago2: string
  cod_alta: number
  cod_baja: number
  cod_barrio_dom_esp: number
  cod_calle_dom_esp: number
  cod_postal_dom_esp: string
  cod_registro_auto: number
  cod_situacion_judicial: number
  cod_tipo_documento: number
  cod_tipo_liquidacion: number
  codigo_acara: string
  codigo_cip_ant: string
  codigo_cip: string
  con_deuda: number
  construccion: boolean
  cuil: string
  cuit_vecino_digital: string
  debito_automatico: boolean
  edificado: boolean
  email_envio_cedulon: string
  emite_cedulon: boolean
  exento: boolean
  exhimido: boolean
  fecha_alta: Date
  fecha_baja_real: Date | null
  fecha_baja: Date
  fecha_cambio_domicilio: Date | null
  fecha_cambio_radicacion: Date | null
  fecha_denuncia_vta: Date | null
  fecha_exencion: Date | null
  fecha_ingreso: Date
  fecha_modificacion: Date
  fecha_vecino_digital: Date | null
  fecha_vto_exencion: Date | null
  jubilado: boolean
  manzana: number
  monto: number
  multas: number
  nom_barrio_dom_esp: string
  nom_calle_dom_esp: string
  nombre: string
  nro_bad: number
  nro_documento: string
  nro_dom_esp: number
  nro_motor: string
  nro_secuencia: number
  ocupante: string
  p_h: number
  pais_dom_esp: string
  parcela: number
  parquizado: boolean
  per_ult: string
  piso_dpto_esp: string
  porcentaje: string
  provincia_dom_esp: string
  responsable: string
  saldo_adeudado: number
  seccion: number
  sexo: string
  superficie_edificada: number
  superficie: number
  telefono: string
  tipo_alta: boolean
  tipo_baja: number
  tributa_minimo: boolean
  ultimo_periodo: ""
  usuario: string
  usuariomodifica: string
  variante: string
}
export interface ReLiquidacion {
  tipo_transaccion: number
  nro_transaccion: number
  nro_pago_parcial: number
  dominio: string
  fecha_transaccion: string
  periodo: string
  monto_original: number
  nro_plan: number | null
  pagado: boolean
  debe: number
  haber: number
  nro_procuracion: number
  pago_parcial: boolean
  vencimiento: string
  nro_cedulon: number
  categoria_deuda: number
  monto_pagado: number
  recargo: number
  honorarios: number
  iva_hons: number
  tipo_deuda: number
  decreto: string
  observaciones: string
  nro_cedulon_paypertic: number
  deuda_activa: number
  des_movimiento: string
  des_categoria: string
  deuda: number
  sel: number
  costo_financiero: number
  des_rubro: string
  cod_tipo_per: number
  sub_total: number
}

export interface InformeCompleto {
  vencimiento: Date
  nro_transaccion: number
  tipo_transaccion: number
  des_transaccion: string
  categoria: string
  periodo: string
  debe: number
  haber: number
  nro_plan: number
  nro_procuracion: number
}

<<<<<<< HEAD
export interface CategoriasDeudaTasa {
  value: string
  text: string
  campo_enlace: string
}

=======
>>>>>>> fa24d688bc56c3e65adf7d8667dfd56e14f0c31f
export interface Valuacion {
  anio: number
  base_imponible: number
}

export interface ConceptoDeAuto {
  dominio: string
  cod_concepto_dominio: number
  des_concepto_dominio: string
  porcentaje: number
  monto: number
  vencimiento: string
  nro_decreto: number
  fecha_alta: string
  activo: number
  anio_desde: number
  anio_hasta: number
  observaciones: string
  objAuditoria: {
    id_auditoria: number
    fecha: string
    usuario: string
    proceso: string
    identificacion: string
    autorizaciones: string
    observaciones: string
    detalle: string
    ip: string
  }
}

export interface Concepto {
  cod_concepto_dominio: number
  des_concepto_dominio: string
  suma: boolean
  activo: boolean
}

export interface CabeceraDeCedulon {
  nroCedulon: number
  denominacion: string
  detalle: string
  nombre: string
  vencimiento: string
  montoPagar: number
  cuit: string
}

export interface VCedulon {
  deudaOriginal: number
  intereses: number
  nro_cedulon_paypertic: number
  pago_parcial: boolean
  pago_a_cuenta: number
  nro_transaccion: number
  periodo: string
  importe: number
  fecha_vencimiento: string
  categoria_deuda: number
}

export interface DetalleCedulon {
  periodo: string
  concepto: string
  montoPagado: number
  montoOriginal: number
  recargo: number
  descInteres: number
  saldoFavor: number
  nro_transaccion: number
}

export interface CedulonImpresion {
  tarjetaDeCredito: string
  cantCuotas: number
  montoCuota: number
  montoOriginal: number
  credito: number
  interesMora: number
  descuento: number
  costoFinanciero: number
  total: number
}
