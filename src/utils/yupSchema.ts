import * as yup from "yup"

export const schema = yup.object({
  datosPropietario: yup
    .string()
    .typeError("Ingresa un número de CUIT/CUIL")
    .required("Este campo es obligatorio"),
  nombreComercio: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  transporte: yup.string().required("Este campo es obligatorio"),
  descripcion: yup.string().required("Este campo es obligatorio"),
  fechaCarga: yup.string().required("Este campo es obligatorio"),
  legajo: yup.string().required("Este campo es obligatorio"),
  nroExpediente: yup.string().required("Este campo es obligatorio"),
  calle: yup.string().required("Este campo es obligatorio"),
  nroDomicilio: yup.string().required("Este campo es obligatorio"),
  piso: yup.string().required("Este campo es obligatorio"),
  nroLocal: yup.string().required("Este campo es obligatorio"),
  barrio: yup.string().required("Este campo es obligatorio"),
  ciudad: yup.string().required("Este campo es obligatorio"),
  zona: yup.string().required("Este campo es obligatorio"),
  periodoLiquidacion: yup.string().required("Este campo es obligatorio"),
  tipoLiquidacion: yup.string().required("Este campo es obligatorio"),
  primerPeriodo: yup.string().required("Este campo es obligatorio"),
  ultimoPeriodo: yup.string().required("Este campo es obligatorio"),
  zonaLiquidacion: yup.string().required("Este campo es obligatorio"),
  cuit: yup.number().required("Este campo es obligatorio"),
  condicionImpositiva: yup.string().required("Este campo es obligatorio"),
  categoria: yup.string().required("Este campo es obligatorio"),
  ingresosBrutos: yup.string().required("Este campo es obligatorio"),
  excento: yup.boolean().required("Este campo es obligatorio"),
  convenioMultilateral: yup.boolean().required("Este campo es obligatorio"),
  fechaInicio: yup.boolean().required("Este campo es obligatorio"),
  nroResHab: yup.number().required("Este campo es obligatorio"),
  fechaHabilitacion: yup.number().required("Este campo es obligatorio"),
  fechaBaja: yup.date().required("Este campo es obligatorio"),
  vencimientoInscrip: yup.number().required("Este campo es obligatorio"),
  baja: yup.number().required("Este campo es obligatorio"),
  caracterEntidad: yup.number().required("Este campo es obligatorio"),
  otraEntidad: yup.string().required("Este campo es obligatorio"),
  situacionComercio: yup.number().required("Este campo es obligatorio"),
  DDjj: yup.boolean().required("Este campo es obligatorio"),
  vecinoDigital: yup.boolean().required("Este campo es obligatorio"),
  fecha: yup.date().required("Este campo es obligatorio"),
  clavePago: yup.string().required("Este campo es obligatorio"),
  codigoGestionWeb: yup.string().required("Este campo es obligatorio"),
})
