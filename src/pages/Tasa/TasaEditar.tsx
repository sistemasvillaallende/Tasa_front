import { useEffect, useState } from "react"
import defaultInputs, { fieldsState } from "../../utils/defaultInputs"
import RenderInputs from "../../components/RenderInputs"
import Button from "../../base-components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { useTasaContext } from "../../context/TasaProvider"

function TasaEditar() {
  const { id } = useParams()
  const { inmuebles } = useTasaContext()
  const detalleInmueble: any = inmuebles?.find(
    (inmueble: any) => inmueble.nro_bad.toString() === id
  )
  const navigate = useNavigate()
  const handleCancelar = (e: any) => {
    e.preventDefalut()
    navigate(`/`)
  }

  const [inputs, setInputs] = useState<any>({})
  useEffect(() => {
    if (!inmuebles) window.location.href = "/"
    const newState: any = {}
    fieldsState.map((fieldName: string) => {
      newState[fieldName] = detalleInmueble && detalleInmueble[fieldName]
    })
    setInputs(newState)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit} className="mb-10">
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">Gestión de Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
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
