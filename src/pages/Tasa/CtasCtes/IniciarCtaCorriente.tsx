import { useState, useEffect, ChangeEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { FormLabel } from "../../../base-components/Form"
import Button from "../../../base-components/Button"
import { useTasaContext } from "../../../context/TasaProvider"
import axios from "axios"
import Cargando from "../../../components/Cargando"
import { useUserContext } from "../../../context/UserProvider"

interface Periodo {
  periodo: string
  [key: string]: any
}

const IniciarCtaCorriente = () => {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState<boolean>(false)
  const { id } = useParams()
  const { getInmueble } = useTasaContext()
  const { user } = useUserContext()

  const detalleInmueble = getInmueble(id)

  const { circunscripcion, seccion, manzana, p_h, parcela } = detalleInmueble ?? {
    circunscripcion: "",
    parcela: "",
    seccion: "",
    manzana: "",
    p_h: "",
  }
  const [periodosExistentes, setPeriodosExistentes] = useState<Periodo[]>([])
  const [periodosIncluidos, setPeriodosIncluidos] = useState<Periodo[]>([])
  const [periodosSeleccionadosExistentes, setPeriodosSeleccionadosExistentes] = useState<string[]>(
    []
  )
  const [periodosSeleccionadosIncluidos, setPeriodosSeleccionadosIncluidos] = useState<string[]>([])

  const moverPeriodoExistentesAIncluidos = () => {
    const nuevosPeriodosIncluidos = periodosExistentes.filter((periodo) =>
      periodosSeleccionadosExistentes.includes(periodo.periodo)
    )
    setPeriodosExistentes(
      periodosExistentes.filter(
        (periodo) => !periodosSeleccionadosExistentes.includes(periodo.periodo)
      )
    )
    setPeriodosIncluidos([...periodosIncluidos, ...nuevosPeriodosIncluidos])
  }

  const moverPeriodoIncluidosAExistentes = () => {
    const nuevosPeriodosExistentes = periodosIncluidos.filter((periodo) =>
      periodosSeleccionadosIncluidos.includes(periodo.periodo)
    )
    setPeriodosIncluidos(
      periodosIncluidos.filter(
        (periodo) => !periodosSeleccionadosIncluidos.includes(periodo.periodo)
      )
    )
    setPeriodosExistentes([...periodosExistentes, ...nuevosPeriodosExistentes])
  }

  const moverTodosExistentesAIncluidos = () => {
    setPeriodosIncluidos([...periodosIncluidos, ...periodosExistentes])
    setPeriodosExistentes([])
  }

  const moverTodosIncluidosAExistentes = () => {
    setPeriodosExistentes([...periodosExistentes, ...periodosIncluidos])
    setPeriodosIncluidos([])
  }

  const traerPeriodos = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_URL_BASE
        }Ctasctes_inmuebles/IniciarCtacte?cir=${circunscripcion}&sec=${seccion}&man=${manzana}&par=${parcela}&p_h=${p_h}`
      const response = await axios.get(apiUrl)
      setPeriodosExistentes(response.data)
      setCargando(true)
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron traer los periodos",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
    }
  }

  useEffect(() => {
    traerPeriodos()
  }, [])

  const cancelar = () => {
    navigate(-1)
  }

  const devolverFechaActual = () => {
    const fechaActual = new Date()
    const dia = fechaActual.getDate()
    const mes = fechaActual.getMonth() + 1
    const anio = fechaActual.getFullYear()
    const diaFormateado = dia < 10 ? "0" + dia : dia
    const mesFormateado = mes < 10 ? "0" + mes : mes
    const fechaActualString = `${diaFormateado}/${mesFormateado}/${anio}`
    return fechaActualString
  }

  const devolverVencimiento = (fecha: string) => {
    const fechaFormateada = formatearFecha(fecha)
    const dia = fechaFormateada.split("/")[0]
    const mes = fechaFormateada.split("/")[1]
    const anio = fechaFormateada.split("/")[2]
    return `${anio}-${mes}-${dia}T00:00:00.000Z`
  }

  const getCurrentFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const iniciarCtaCte = () => {
    const lstCtasTes = periodosIncluidos.map((periodo) => {
      return {
        periodo: periodo.periodo,
        nro_transaccion: periodo.nro_transaccion,
        monto_original: periodo.monto_original,
        debe: periodo.debe,
        vencimiento: devolverVencimiento(periodo.vencimiento),
        tipo_transaccion: periodo.tipo_transaccion,
        circunscripcion: circunscripcion,
        seccion: seccion,
        manzana: manzana,
        parcela: parcela,
        p_h: p_h,
        fecha_transaccion: getCurrentFormattedDate(),
        cedulon_impreso: false,
        nro_pago_parcial: 0,
        nro_plan: 0,
        pagado: false,
        haber: 0.00,
        deuda_activa: false,
        pago_parcial: false,
        categoria_deuda: 0,
        nro_procuracion: 0,
        nro_cedulon: 0,
        monto_pagado: 0,
        recargo: 0,
        honorarios: 0,
        iva_hons: 0,
        tipo_deud: 0,
        decret: "",
        observacione: "",
        nro_cedulon_payperti: 0,
        des_movimient: "Deuda",
        des_categori: "TASA POR SERVICIOS A LA PROPIEDAD",
        deuda: 0,
        sel: 0,
        costo_financiero: 0,
        des_rubro: "",
        cod_tipo_per: 0,
        sub_total: periodo.debe
      }
    })

    const consulta = {
      cir: circunscripcion,
      sec: seccion,
      man: manzana,
      par: parcela,
      p_h: p_h,
      lstCtastes: lstCtasTes,
      auditoria: {
        id_auditoria: 0,
        fecha: devolverFechaActual(),
        usuario: user?.userName,
        proceso: "",
        identificacion: "",
        autorizaciones: "",
        observaciones: "",
        detalle: "",
        ip: "",
      },
    }

    const urlApi = `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/Confirma_iniciar_ctacte`

    axios
      .post(urlApi, consulta)
      .then((response) => {
        if (response.data) {
          Swal.fire({
            title: "Éxito",
            text: "Se inició la cuenta corriente correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          })
          navigate(-1)
        } else {
          Swal.fire({
            title: "Error",
            text: "No se pudo iniciar la cuenta corriente",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          })
        }
      })
      .catch((error) => {
        Swal.fire({
          title: `Error: ${error.response.status}`,
          text: error.message,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        })
        console.log(error)
      })
  }

  const handleChangeExistentes = (event: ChangeEvent<HTMLSelectElement>) => {
    setPeriodosSeleccionadosExistentes(
      Array.from(event.target.selectedOptions, (option) => option.value)
    )
  }

  const handleChangeIncluidos = (event: ChangeEvent<HTMLSelectElement>) => {
    setPeriodosSeleccionadosIncluidos(
      Array.from(event.target.selectedOptions, (option) => option.value)
    )
  }

  const formatearFecha = (fechaCompleta: string): string => {
    const [fecha, hora] = fechaCompleta.split(" ")
    const [dia, mes, anio] = fecha.split("/")
    const nuevaFecha = `${dia}/${mes}/${anio}`
    return nuevaFecha
  }

  return (
    <>
      <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4">
        <div className="col-span-12 intro-y lg:col-span-12">
          <div className="flex flex-col gap-6 mt-3">
            <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
              <h2>Iniciar Cuenta Corriente</h2>
              <h2>Badec: {detalleInmueble?.nro_bad}</h2>
            </div>
            {!cargando && <Cargando mensaje="cargando los periodos" />}
            {cargando && (
              <>
                <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-6">
                  <div className="basis-2/6 intro-y">
                    <div className="col-span-12 intro-y lg:col-span-4">
                      <FormLabel htmlFor="dominio-input" className="sm:w-50">
                        Periodos Existentes
                      </FormLabel>
                      <div className="col-span-12 intro-y lg:col-span-2">
                        <select
                          multiple={true}
                          onChange={handleChangeExistentes}
                          value={periodosSeleccionadosExistentes}
                          className="selectorDePeriodos"
                        >
                          {periodosExistentes.map((periodo: Periodo) => (
                            <option key={periodo.periodo} value={periodo.periodo}>
                              {periodo.periodo}
                              {" - "}
                              {formatearFecha(periodo.vencimiento)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="basis-2/6 intro-y lg:col-span-2 mt-7 flex flex-col items-center">
                    <Button
                      variant="primary"
                      className="ml-3 mb-2"
                      onClick={moverPeriodoExistentesAIncluidos}
                    >
                      {">"}
                    </Button>
                    <br />
                    <Button
                      variant="primary"
                      className="ml-3 mb-2"
                      onClick={moverPeriodoIncluidosAExistentes}
                    >
                      {"<"}
                    </Button>
                    <br />
                    <Button
                      variant="primary"
                      className="ml-3 mb-2"
                      onClick={moverTodosExistentesAIncluidos}
                    >
                      {">>"}
                    </Button>
                    <br />
                    <Button
                      variant="primary"
                      className="ml-3"
                      onClick={moverTodosIncluidosAExistentes}
                    >
                      {"<<"}
                    </Button>
                  </div>
                  <div className="basis-2/6 intro-y lg:col-span-4">
                    <div className="col-span-12 intro-y lg:col-span-2">
                      <FormLabel htmlFor="dominio-input" className="sm:w-50">
                        Periodos Incluidos
                      </FormLabel>
                      <div className="col-span-12 intro-y lg:col-span-4">
                        <select
                          multiple={true}
                          onChange={handleChangeIncluidos}
                          value={periodosSeleccionadosIncluidos}
                          className="selectorDePeriodos"
                        >
                          {periodosIncluidos.map((periodo: Periodo) => (
                            <option key={periodo.periodo} value={periodo.periodo}>
                              {periodo.periodo}
                              {" - "}
                              {formatearFecha(periodo.vencimiento)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 intro-y lg:col-span-12">
                  <Button variant="primary" className="ml-3" onClick={iniciarCtaCte}>
                    Confirmar
                  </Button>
                  <Button variant="outline-secondary" className="ml-3" onClick={cancelar}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default IniciarCtaCorriente
