import { useState } from "react"
import defaultInputs from "../../utils/defaultInputs"
import RenderInputs from "../../components/RenderInputs"
import Button from "../../base-components/Button"
import ModalDatos from "./NuevoLegajo/ModalDatos"
import ModalCalle from "./NuevoLegajo/ModalCalle"

function TasaEditar() {
  const [openModalDatos, setOpenModalDatos] = useState(false)
  const [openModalCalle, setOpenModalCalle] = useState(false)

  return (
    <form className="mb-10">
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">Gestión de Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
        <ModalDatos openModalDatos={openModalDatos} setOpenModalDatos={setOpenModalDatos} />
        <ModalCalle openModalCalle={openModalCalle} setOpenModalCalle={setOpenModalCalle} />
        {/* BEGIN: Page Layout */}
        <RenderInputs
          list={defaultInputs.casaCentral}
          setOpenModalDatos={setOpenModalDatos}
          title="Casa Central"
          bgSlate
        />
        <RenderInputs
          list={defaultInputs.datosDomicilio}
          setOpenModalCalle={setOpenModalCalle}
          title="Datos del Domicilio"
        />
        <RenderInputs list={defaultInputs.datosLiquidacion} title="Datos de Liquidación" bgSlate />{" "}
        <RenderInputs list={defaultInputs.datosFiscales} title="Datos Fiscales" />{" "}
        <RenderInputs list={defaultInputs.footer} bgSlate /> {/* END: Page Layout */}
        {/* END: Page Layout */}
      </div>
      <div className="flex justify-end mr-5 mt-5">
        <Button variant="primary" className="text-xl">
          Cancelar
        </Button>
        <Button variant="secondary" className="ml-8 text-white text-xl" type="submit">
          Confirmar
        </Button>
      </div>
    </form>
  )
}

export default TasaEditar
