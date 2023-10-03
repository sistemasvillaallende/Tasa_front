const defaultInputs = {
  casaCentral: [
    {
      name: "datosPropietario",
      label: "Datos Propietario*",
      type: "text",
      placeholder: "Buscar",
      minWidth: "l",
    },
    {
      name: "nombreComercio",
      label: "Nombre del Comercio*",
      type: "text",
      placeholder: "Ingrese el nombre del comercio",
      minWidth: "l",
    },
    {
      name: "transporte",
      label: "Transporte",
      type: "checkbox",
    },
    {
      name: "descripcion",
      label: "Descripción*",
      type: "textarea",
      placeholder: "Escriba aquí",
      minWidth: "m",
    },
    {
      name: "fechaCarga",
      label: "Fecha de Carga*",
      type: "text",
      placeholder: "Carga automática",
    },
    {
      name: "legajo",
      label: "Legajo*",
      type: "text",
      placeholder: "Se completa",
    },
    {
      name: "nroExpediente",
      label: "Nro. Expediente*",
      type: "number",
      placeholder: "",
    },
  ],
  datosDomicilio: [
    {
      name: "conLocal",
      label: "Con Local",
      type: "radio",
    },
    {
      name: "conLocal",
      label: "Sin Local",
      type: "radio",
    },
    {
      name: "calle",
      label: "Calle*",
      type: "text",
      placeholder: "Buscar",
      minWidth: "m",
    },
    {
      name: "nroDomicilio",
      label: "Nro. de Domicilio",
      type: "number",
      placeholder: "",
    },
    {
      name: "piso",
      label: "Piso",
      type: "number",
      placeholder: "",
    },
    {
      name: "nroLocal",
      label: "Nro. de Local",
      type: "number",
      placeholder: "",
    },
    {
      name: "barrio",
      label: "Barrio",
      type: "text",
      placeholder: "",
      minWidth: "m",
    },
    {
      name: "ciudad",
      label: "Ciudad",
      type: "text",
      placeholder: "",
    },
    {
      name: "zona",
      label: "Zona",
      type: "select",
      placeholder: "Seleccionar",
    },
  ],
  datosLiquidacion: [
    {
      name: "periodoLiquidacion",
      label: "Periodo de Liquidación",
      type: "select",
      placeholder: "Seleccionar",
      minWidth: "m",
    },
    {
      name: "tipoLiquidacion",
      label: "Tipo de Liquidación",
      type: "select",
      pplaceholder: "Seleccionar",
      minWidth: "m",
    },
    {
      name: "primerPeriodo",
      label: "Primer periodo de liquidación",
      type: "select",
      placeholder: "",
      minWidth: "m",
    },
    {
      name: "ultimoPeriodo",
      label: "Último periodo de liquidación",
      type: "select",
      placeholder: "Seleccionar",
      minWidth: "m",
    },
    {
      name: "zonaLiquidacion",
      label: "Zona de Liquidación",
      type: "select",
      placeholder: "Seleccionar",
      minWidth: "m",
    },
    {
      name: "cuit",
      label: "Cuit",
      type: "number",
      placeholder: "",
      minWidth: "m",
    },
  ],
  datosFiscales: [
    {
      name: "condicionImpositiva",
      label: "Condición impositiva",
      type: "select",
      placeholder: "Seleccionar",
      minWidth: "m",
    },
    {
      name: "categoria",
      label: "Categoría",
      type: "text",
      placeholder: "",
      minWidth: "m",
    },
    {
      name: "ingresosBrutos",
      label: "Ingresos Brutos",
      type: "text",
      placeholder: "",
    },
    {
      name: "excento",
      label: "Excento",
      type: "checkbox",
    },
    {
      name: "convenioMultilateral",
      label: "Convenio Multilateral",
      type: "checkbox",
    },
    {
      name: "fechaInicio",
      label: "Fecha de inicio",
      type: "date",
      placeholder: "Seleccionar",
    },
    {
      name: "nroResHab",
      label: "Nro de Res. Hab",
      type: "number",
      placeholder: "",
    },
    {
      name: "fechaHabilitacion",
      label: "Fecha habilitación",
      type: "date",
      placeholder: "Seleccionar",
    },
    {
      name: "fechaBaja",
      label: "Fecha de baja",
      type: "date",
      placeholder: "Seleccionar",
    },
    {
      name: "vencimientoInscrip",
      label: "Vencimiento Inscrip.",
      type: "date",
      placeholder: "Seleccionar",
      disabled: true,
    },
    {
      name: "baja",
      label: "Baja",
      type: "checkbox",
    },
    {
      name: "caracterEntidad",
      label: "Caracter de la entidad",
      type: "select",
      placeholder: "Seleccionar",
      minWidth: "m",
    },
    {
      name: "otraEntidad",
      label: "Otra entidad",
      type: "text",
      placeholder: "",
      minWidth: "m",
    },
    {
      name: "situacionComercio",
      label: "Situación del comercio",
      type: "text",
      placeholder: "",
      minWidth: "m",
    },
    {
      name: "DDjj",
      label: "DDjj Anual",
      type: "checkbox",
    },
    {
      name: "vecinoDigital",
      label: "Vecino Digital",
      type: "checkbox",
    },
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
      placeholder: "Año/Mes (carga automatica)",
    },
  ],
  footer: [
    {
      name: "clavePago",
      label: "Clave de pago",
      type: "text",
      placeholder: "Carga Automática",
      minWidth: "m",
    },
    {
      name: "codigoGestionWeb",
      label: "Código de gestión web",
      type: "text",
      placeholder: "Carga Automática",
      minWidth: "m",
    },
  ],
}

export const domicilioComercialInputs = [
  {
    name: "calle",
    label: "Calle",
    type: "text",
    placeholder: "Ingrese la Calle",
    minWidth: "m",
  },
  {
    name: "nroDomicilio",
    label: "Nro. de domicilio",
    type: "number",
    placeholder: "Ingrese el nro.",
    minWidth: "s",
  },
  {
    name: "codigoPostal",
    label: "Código Postal",
    type: "text",
    placeholder: "Ingrese C.P",
    minWidth: "s",
  },
  {
    name: "barrio",
    label: "Barrio",
    type: "text",
    placeholder: "Ingrese el barrio",
    minWidth: "m",
  },
  {
    name: "ciudad",
    label: "Ciudad",
    type: "text",
    placeholder: "Ingrese la ciudad",
    minWidth: "m",
  },
  {
    name: "provincia",
    label: "Provincia",
    type: "text",
    placeholder: "Ingrese la provincia",
    minWidth: "m",
  },
  {
    name: "pais",
    label: "País",
    type: "text",
    placeholder: "Ingrese el país",
    minWidth: "m",
  },
]

export default defaultInputs
