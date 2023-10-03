import { useState } from "react"
import defaultInputs from "../../utils/defaultInputs"
import RenderTexts from "../../components/RenderTexts"
// import { schema } from "../../utils/yupSchema"
// import { useForm } from "react-hook-form"
// import { yupResolver } from "@hookform/resolvers/yup"
import Button from "../../base-components/Button"
import ModalDatos from "./NuevoLegajo/ModalDatos"
import ModalCalle from "./NuevoLegajo/ModalCalle"

function TasaDetalle() {
  // const {
  // register,
  // handleSubmit,
  // reset,
  // formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // })
  const [openModalDatos, setOpenModalDatos] = useState(false)
  const [openModalCalle, setOpenModalCalle] = useState(false)

  return (
    <form className="mb-10">
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">Gestión de Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
        {/* BEGIN: Page Layout */}
        <RenderTexts list={defaultInputs.casaCentral} title="Casa Central" bgSlate />
        <RenderTexts list={defaultInputs.datosDomicilio} title="Datos del Domicilio" />
        <RenderTexts
          list={defaultInputs.datosLiquidacion}
          title="Datos de Liquidación"
          bgSlate
        />{" "}
        <RenderTexts list={defaultInputs.datosFiscales} title="Datos Fiscales" />{" "}
        <RenderTexts list={defaultInputs.footer} bgSlate /> {/* END: Page Layout */}
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

export default TasaDetalle
