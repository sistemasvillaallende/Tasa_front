import { useState } from "react"
import defaultInputs from "../../../utils/defaultInputs"
import RenderInputs from "../../../components/RenderInputs"
import Button from "../../../base-components/Button"
import ModalDatos from "./ModalDatos"
import ModalCalle from "./ModalCalle"
import { useTasaContext } from "../../../context/TasaProvider"
import { useNavigate } from "react-router-dom"

function NuevaTasa() {
  const [openModalDatos, setOpenModalDatos] = useState(false)
  const [openModalCalle, setOpenModalCalle] = useState(false)
  const { inmuebles } = useTasaContext()
  const [inputs, setInputs] = useState<any>({
    baldio_country: false,
    baldio_sucio: false,
    ciudad_dom_esp: "",
    clave_pago: "",
    cod_postal: "",
    construccion: false,
    cuil: "",
    debito_automatico: false,
    edificado: false,
    emite_cedulon: false,
    exhimido: false,
    fecha_cambio_domicilio: "",
    jubilado: false,
    manzana: "",
    nom_barrio_dom_esp: "",
    nom_calle_dom_esp: "",
    nombrePropietario: "",
    nro_dom_esp: "",
    ocupante: "",
    parcela: "",
    parquizado: false,
    saldo_adeudado: "",
    superficie_edificada: "",
    superficie: "",
    ultimo_periodo: "",
  })
  const navigate = useNavigate()
  const handleCancelar = (e: any) => {
    e.preventDefalut()
    setInputs({
      nombre: "",
      cuil: "",
      fecha_cambio_domicilio: "",
      ocupante: "",
      cod_postal: "",
      nom_calle_dom_esp: "",
      nro_dom_esp: "",
      manzana: "",
      parcela: "",
      nom_barrio_dom_esp: "",
      ciudad_dom_esp: "",
      superficie: "",
      superficie_edificada: "",
      baldio_country: false,
      baldio_sucio: false,
      construccion: false,
      edificado: false,
      exhimido: false,
      jubilado: false,
      parquizado: false,
      debito_automatico: false,
      saldo_adeudado: "",
      ultimo_periodo: "",
      emite_cedulon: false,
      clave_pago: "",
    })
    navigate(`/`)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const urlApi = `${import.meta.env.VITE_URL_TASA}NuevaTasa`
    const requestBody = {
      nombre: "",
      cuil: "",
      fecha_cambio_domicilio: "",
      ocupante: "",
      cod_postal: "",
      nom_calle_dom_esp: "",
      nro_dom_esp: "",
      manzana: "",
      parcela: "",
      nom_barrio_dom_esp: "",
      ciudad_dom_esp: "",
      superficie: "",
      superficie_edificada: "",
      baldio_country: false,
      baldio_sucio: false,
      construccion: false,
      edificado: false,
      exhimido: false,
      jubilado: false,
      parquizado: false,
      debito_automatico: false,
      saldo_adeudado: "",
      ultimo_periodo: "",
      emite_cedulon: false,
      clave_pago: "",
    }
    // TODO: Falta endpoint
    console.log(urlApi, requestBody)
  }

  return (
    <form className="mb-10" onSubmit={handleSubmit}>
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-xl font-bold">Nueva Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
        <ModalDatos openModalDatos={openModalDatos} setOpenModalDatos={setOpenModalDatos} />
        <ModalCalle openModalCalle={openModalCalle} setOpenModalCalle={setOpenModalCalle} />
        {/* BEGIN: Page Layout */}
        <RenderInputs
          data={inmuebles}
          list={defaultInputs.casaCentral}
          title="Casa Central"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />
        <RenderInputs
          data={inmuebles}
          list={defaultInputs.datosDomicilio}
          title="Datos del Domicilio"
          formInputs={inputs}
          setInputs={setInputs}
        />
        <RenderInputs
          data={inmuebles}
          list={defaultInputs.datosLiquidacion}
          title="Datos de Liquidación"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />{" "}
        <RenderInputs
          data={inmuebles}
          formInputs={inputs}
          list={defaultInputs.footer}
          setInputs={setInputs}
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

export default NuevaTasa
