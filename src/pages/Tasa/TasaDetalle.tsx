import defaultInputs from "../../utils/defaultInputs"
import RenderTexts from "../../components/RenderTexts"
import { useParams } from "react-router-dom"
import { useTasaContext } from "../../context/TasaProvider"
import { useEffect, useState } from "react"
import { Inmueble } from "../../interfaces/Inmueble"

function TasaDetalle() {
  const { id } = useParams()
  const { inmuebles } = useTasaContext()
  const [detalleInmueble, setDetalleInmueble] = useState<Inmueble | undefined>()
  useEffect(() => {
    if (!inmuebles) window.location.href = "/"
  }, [])
  useEffect(() => {
    if (!detalleInmueble) {
      setDetalleInmueble(inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id))
    }
  }, [inmuebles])
  return (
    <form className="mb-10">
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">Gestión de Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
        {/* Datos del propietadio */}
        <RenderTexts
          data={detalleInmueble}
          list={defaultInputs.casaCentral}
          title="Datos del propietario"
          bgSlate
        />
        {/* Datos de domicilio */}
        <RenderTexts
          data={detalleInmueble}
          list={defaultInputs.datosDomicilio}
          title="Datos del Domicilio"
        />
        {/* Datos de liquidación */}
        <RenderTexts
          data={detalleInmueble}
          list={defaultInputs.datosLiquidacion}
          title="Datos de Liquidación"
          bgSlate
        />{" "}
        {/* Footer */}
        <RenderTexts data={detalleInmueble} list={defaultInputs.footer} />{" "}
      </div>
    </form>
  )
}

export default TasaDetalle
