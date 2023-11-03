import { useEffect, useState } from "react"
import defaultInputs, { fieldsState } from "../../utils/defaultInputs"
import RenderInputs from "../../components/RenderInputs"
import Button from "../../base-components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { useTasaContext } from "../../context/TasaProvider"
import Swal from "sweetalert2"
import axios from "axios"

function TasaEditar() {
  const { detalleInmueble } = useTasaContext()

  const navigate = useNavigate()
  const handleCancelar = (e: any) => {
    e.preventDefalut()
    navigate(`/`)
  }

  const [inputs, setInputs] = useState<any>({})
  useEffect(() => {
    if (!detalleInmueble) window.location.href = "/"
    const newState: any = {}
    fieldsState.map((fieldName: string) => {
      newState[fieldName] = detalleInmueble && detalleInmueble[fieldName]
    })
    setInputs(newState)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const urlApi = `${import.meta.env.VITE_URL_TASA}Updateinmueble`
    const requestBody = {
      circunscripcion: 1,
      seccion: 1,
      manzana: 1,
      parcela: 18,
      p_h: 0,
      cod_barrio: 0,
      nro_bad: 0,
      nombre: "string",
      exhimido: true,
      jubilado: true,
      cod_barrio_dom_esp: 0,
      nom_barrio_dom_esp: "string",
      cod_calle_dom_esp: 0,
      nom_calle_dom_esp: "string",
      nro_dom_esp: 0,
      piso_dpto_esp: "string",
      ciudad_dom_esp: "string",
      provincia_dom_esp: "string",
      pais_dom_esp: "string",
      union_tributaria: true,
      edificado: true,
      parquizado: true,
      baldio_sucio: true,
      construccion: true,
      cod_uso: 0,
      superficie: 0,
      piso_dpto: "string",
      cod_calle_pf: 0,
      nro_dom_pf: 0,
      cod_postal: "string",
      ultimo_periodo: "string",
      fecha_cambio_domicilio: "2023-11-01T02:42:11.645Z",
      ocupante: "string",
      emite_cedulon: true,
      baldio_country: true,
      debito_automatico: true,
      nro_secuencia: 0,
      cod_situacion_judicial: 0,
      fecha_alta: "2023-11-01T02:42:11.645Z",
      clave_pago: "string",
      municipal: true,
      email_envio_cedulon: "string",
      telefono: "string",
      celular: "string",
      cod_tipo_per_elegido: 0,
      con_deuda: 0,
      saldo_adeudado: 0,
      superficie_edificada: 0,
      cod_estado: 0,
      cedulon_digital: 0,
      oculto: 0,
      nro_doc_ocupante: "string",
      cuit_ocupante: "string",
      nro_bad_ocupante: 0,
      cod_categoria_zona_liq: "string",
      tipo_ph: 0,
      fecha_tipo_ph: "2023-11-01T02:42:11.645Z",
      cuil: "string",
      fechA_VECINO_DIGITAL: "2023-11-01T02:42:11.645Z",
      cuiT_VECINO_DIGITAL: "string",
      lat: "string",
      long: "string",
      diR_GOOGLE: "string",
      total_row: 0,
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
    // axios
    //   .post(urlApi, requestBody)
    //   .then(() => {
    //     Swal.fire({
    //       title: "Tasa Actualizada",
    //       text: "La actualización se ha realizado correctamente.",
    //       icon: "success",
    //       confirmButtonText: "Aceptar",
    //       confirmButtonColor: "#27a3cf",
    //     })
    //     navigate(`/detalle/${detalleInmueble?.nro_bad}`)
    //   })
    //   .catch((error) => {
    //     Swal.fire({
    //       title: `${error.response.status}: ${error.response.statusText}`,
    //       text: error.message,
    //       icon: "error",
    //       confirmButtonText: "Aceptar",
    //       confirmButtonColor: "#27a3cf",
    //     })
    //     console.error(error)
    //   })
    console.log("urlApi", urlApi, "requestBody", requestBody)
  }
  return (
    <form onSubmit={handleSubmit} className="mb-10">
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">Gestión de Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
        <RenderInputs
          list={defaultInputs.casaCentral}
          title="Casa Central"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />
        <RenderInputs
          list={defaultInputs.datosDomicilio}
          title="Datos del Domicilio"
          formInputs={inputs}
          setInputs={setInputs}
        />
        <RenderInputs
          list={defaultInputs.datosLiquidacion}
          title="Datos de Liquidación"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />{" "}
        <RenderInputs
          list={defaultInputs.footer}
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />{" "}
        {/* END: Page Layout */}
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
