import * as yup from "yup"
import { validateCuil } from "./cuilValidator"

export const formSchema = yup.object({
  nombre: yup.number().typeError("Ingresa un nombre").required("Este campo es obligatorio"),
  cuil: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio")
    .test("validate-cuil", "Ingresa un número de CUIT/CUIL válido", (value) =>
      validateCuil(value?.toString() as string)
    ),
  fechaCambioDomicilio: yup
    .date()
    .typeError("Selecciona una fecha")
    .required("Este campo es obligatorio"),
  ocupante: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  codigoPostal: yup
    .number()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  legajo: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  conLocal: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  calle: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  nroDomicilio: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  piso: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  nroLocal: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  barrio: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  ciudad: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  zona: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  periodoLiquidacion: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  tipoLiquidacion: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  primerPeriodo: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  ultimoPeriodo: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  zonaLiquidacion: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  cuit: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  condicionImpositiva: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  categoria: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  ingresosBrutos: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  excento: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  convenioMultilateral: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  fechaInicio: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  nroResHab: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  fechaHabilitacion: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  fechaBaja: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  vencimientoInscrip: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  baja: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  caracterEntidad: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  otraEntidad: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  situacionComercio: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  DDjj: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  vecinoDigital: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  fecha: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  clavePago: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
  codigoGestionWeb: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
})
