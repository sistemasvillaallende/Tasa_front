import { useEffect, useState } from "react"
import defaultInputs, { fieldsState } from "../../utils/defaultInputs"
import RenderInputs from "../../components/RenderInputs"
import Button from "../../base-components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { useTasaContext } from "../../context/TasaProvider"
import Swal from "sweetalert2"
import axios from "axios"

function TasaEditar() {
  const { getInmueble } = useTasaContext()
  const { id } = useParams()
  const detalleInmueble = getInmueble(id)
  const { circunscripcion, seccion, manzana, p_h, parcela } = detalleInmueble ?? {
    circunscripcion: 0,
    parcela: 0,
    seccion: 0,
    manzana: 0,
    p_h: 0,
  }
  const navigate = useNavigate()
  const handleCancelar = (e: any) => {
    e.preventDefalut()
    navigate(`/`)
  }

  const [inputs, setInputs] = useState<any>({})
  useEffect(() => {
    // if (!detalleInmueble) window.location.href = "/"
    const newState: any = {}
    fieldsState.map((fieldName: string) => {
      newState[fieldName] = detalleInmueble && detalleInmueble[fieldName]
    })
    setInputs(newState)
  }, [detalleInmueble])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const urlApi = `${import.meta.env.VITE_URL_TASA}Updateinmueble`
    const requestBody = {
      circunscripcion: circunscripcion,
      seccion: seccion,
      manzana: manzana,
      parcela: parcela,
      p_h: p_h,
      cod_barrio: inputs.cod_barrio ?? detalleInmueble.cod_barrio,
      nro_bad: inputs.nro_bad ?? detalleInmueble.nro_bad,
      nombre: inputs.nombre ?? detalleInmueble.nombre,
      exhimido: inputs.exhimido ?? detalleInmueble.exhimido,
      jubilado: inputs.jubilado ?? detalleInmueble.jubilado,
      cod_barrio_dom_esp: inputs.cod_barrio_dom_esp ?? detalleInmueble.cod_barrio_dom_esp,
      nom_barrio_dom_esp: inputs.nom_barrio_dom_esp ?? detalleInmueble.nom_barrio_dom_esp,
      cod_calle_dom_esp: inputs.cod_calle_dom_esp ?? detalleInmueble.cod_calle_dom_esp,
      nom_calle_dom_esp: inputs.nom_calle_dom_esp ?? detalleInmueble.nom_calle_dom_esp,
      nro_dom_esp: inputs.nro_dom_esp ?? detalleInmueble.nro_dom_esp,
      piso_dpto_esp: inputs.piso_dpto_esp ?? detalleInmueble.piso_dpto_esp,
      ciudad_dom_esp: inputs.ciudad_dom_esp ?? detalleInmueble.ciudad_dom_esp,
      provincia_dom_esp: inputs.provincia_dom_esp ?? detalleInmueble.provincia_dom_esp,
      pais_dom_esp: inputs.pais_dom_esp ?? detalleInmueble.pais_dom_esp,
      union_tributaria: inputs.union_tributaria ?? detalleInmueble.union_tributaria,
      edificado: inputs.edificado ?? detalleInmueble.edificado,
      parquizado: inputs.parquizado ?? detalleInmueble.parquizado,
      baldio_sucio: inputs.baldio_sucio ?? detalleInmueble.baldio_sucio,
      construccion: inputs.construccion ?? detalleInmueble.construccion,
      cod_uso: inputs.cod_uso ?? detalleInmueble.cod_uso,
      superficie: inputs.superficie ?? detalleInmueble.superficie,
      piso_dpto: inputs.piso_dpto ?? detalleInmueble.piso_dpto,
      cod_calle_pf: inputs.cod_calle_pf ?? detalleInmueble.cod_calle_pf,
      nro_dom_pf: inputs.nro_dom_pf ?? detalleInmueble.nro_dom_pf,
      cod_postal: inputs.cod_postal ?? detalleInmueble.cod_postal,
      ultimo_periodo: inputs.ultimo_periodo ?? detalleInmueble.ultimo_periodo,
      fecha_cambio_domicilio:
        inputs.fecha_cambio_domicilio ?? detalleInmueble.fecha_cambio_domicilio,
      ocupante: inputs.ocupante ?? detalleInmueble.ocupante,
      emite_cedulon: inputs.emite_cedulon ?? detalleInmueble.emite_cedulon,
      baldio_country: inputs.baldio_country ?? detalleInmueble.baldio_country,
      debito_automatico: inputs.debito_automatico ?? detalleInmueble.debito_automatico,
      nro_secuencia: inputs.nro_secuencia ?? detalleInmueble.nro_secuencia,
      cod_situacion_judicial:
        inputs.cod_situacion_judicial ?? detalleInmueble.cod_situacion_judicial,
      fecha_alta: inputs.fecha_alta ?? detalleInmueble.fecha_alta,
      clave_pago: inputs.clave_pago ?? detalleInmueble.clave_pago,
      municipal: inputs.municipal ?? detalleInmueble.municipal,
      email_envio_cedulon: inputs.email_envio_cedulon ?? detalleInmueble.email_envio_cedulon,
      telefono: inputs.telefono ?? detalleInmueble.telefono,
      celular: inputs.celular ?? detalleInmueble.celular,
      cod_tipo_per_elegido: inputs.cod_tipo_per_elegido ?? detalleInmueble.cod_tipo_per_elegido,
      con_deuda: inputs.con_deuda ?? detalleInmueble.con_deuda,
      saldo_adeudado: inputs.saldo_adeudado ?? detalleInmueble.saldo_adeudado,
      superficie_edificada: inputs.superficie_edificada ?? detalleInmueble.superficie_edificada,
      cod_estado: inputs.cod_estado ?? detalleInmueble.cod_estado,
      cedulon_digital: inputs.cedulon_digital ?? detalleInmueble.cedulon_digital,
      oculto: inputs.oculto ?? detalleInmueble.oculto,
      nro_doc_ocupante: inputs.nro_doc_ocupante ?? detalleInmueble.nro_doc_ocupante,
      cuit_ocupante: inputs.cuit_ocupante ?? detalleInmueble.cuit_ocupante,
      nro_bad_ocupante: inputs.nro_bad_ocupante ?? detalleInmueble.nro_bad_ocupante,
      cod_categoria_zona_liq:
        inputs.cod_categoria_zona_liq ?? detalleInmueble.cod_categoria_zona_liq,
      tipo_ph: inputs.tipo_ph ?? detalleInmueble.tipo_ph,
      fecha_tipo_ph: inputs.fecha_tipo_ph ?? detalleInmueble.fecha_tipo_ph,
      cuil: inputs.cuil ?? detalleInmueble.cuil,
      fechA_VECINO_DIGITAL: inputs.fechA_VECINO_DIGITAL ?? detalleInmueble.fechA_VECINO_DIGITAL,
      cuiT_VECINO_DIGITAL: inputs.cuiT_VECINO_DIGITAL ?? detalleInmueble.cuiT_VECINO_DIGITAL,
      lat: inputs.lat ?? detalleInmueble.lat,
      long: inputs.long ?? detalleInmueble.long,
      diR_GOOGLE: inputs.diR_GOOGLE ?? detalleInmueble.diR_GOOGLE,
      total_row: inputs.total_row ?? detalleInmueble.total_row,
      objAuditoria: {
        id_auditoria: 0,
        fecha: "string",
        usuario: "yo",
        proceso: "string",
        identificacion: "string",
        autorizaciones: "string",
        observaciones: "string",
        detalle: "string",
        ip: "string",
      },
    }
    axios
      .post(urlApi, requestBody)
      .then(() => {
        Swal.fire({
          title: "Tasa Actualizada",
          text: "La actualización se ha realizado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        })
        navigate(`/detalle/${detalleInmueble?.nro_bad}`)
      })
      .catch((error) => {
        Swal.fire({
          title: `${error.response.status}: ${error.response.statusText}`,
          text: error.message,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        })
        console.error(error)
      })
  }
  return (
    <form onSubmit={handleSubmit} className="mb-10">
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">Gestión de Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
        <RenderInputs
          list={defaultInputs.casaCentral ?? detalleInmueble.list}
          title="Casa Central"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />
        <RenderInputs
          list={defaultInputs.datosDomicilio ?? detalleInmueble.list}
          title="Datos del Domicilio"
          formInputs={inputs}
          setInputs={setInputs}
        />
        <RenderInputs
          list={defaultInputs.datosLiquidacion ?? detalleInmueble.list}
          title="Datos de Liquidación"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />{" "}
        {/* END: Page Layout */}
      </div>
      <div className="flex justify-end mr-5 mt-5">
        <Button variant="outline-secondary" className="text-xl" onClick={handleCancelar}>
          Cancelar
        </Button>
        <Button variant="primary" className="ml-8 text-white text-xl" type="submit">
          Confirmar
        </Button>
      </div>
    </form>
  )
}

export default TasaEditar
