import React, { useState } from "react"
import Lucide from "../../../base-components/Lucide"
import Button from "../../../base-components/Button"
import { FormInput } from "../../../base-components/Form"

const ModalDatos = ({
  openModalDatos,
  setOpenModalDatos,
}: {
  openModalDatos: boolean
  setOpenModalDatos: Function
}) => {
  const handleClose = () => {
    setOpenModalDatos(!openModalDatos)
  }
  const [valueRadio, setValueRadio] = useState("")
  const handleRadio = (e: any) => {
    e.preventDefault()
    const { value } = e.target
    setValueRadio(value)
  }
  return (
    <>
      {openModalDatos && (
        <div className="fixed flex justify-center items-center bg-[#00000090] top-0 left-0 right-0 z-50 w-full overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full scroll-smooth">
          <div className="relative mt-20 w-full max-w-2xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex flex-col items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
                <button
                  onClick={handleClose}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <Lucide icon="X"></Lucide>
                </button>
                <h3 className="text-xl font-semibold text-danger mb-5">Datos del propietario</h3>
                <div className="mb-10">
                  {/* Inputs Radio */}
                  <label className="text-base">
                    <input
                      className="mr-2"
                      type="radio"
                      id="name"
                      value="name"
                      checked={valueRadio === "name"}
                      name="datosPropietario"
                      onChange={handleRadio}
                    />
                    Nombre o Descripción
                  </label>

                  <label className="ml-20 text-base">
                    <input
                      className="mr-2"
                      type="radio"
                      id="number"
                      value="number"
                      name="datosPropietario"
                      checked={valueRadio === "number"}
                      onChange={handleRadio}
                    />
                    Número o Código
                  </label>
                </div>

                {/* Inputs Text */}
                <div className="w-full">
                  <label className="">
                    <FormInput
                      type="text"
                      placeholder="Ingrese el nombre"
                      className={`shadow-sm shadow-black mr-5 w-[40%] ${"placeholder:text-slate-900"}`}
                    />
                  </label>
                  <label>
                    <FormInput
                      type="text"
                      placeholder="Buscar"
                      className={`shadow-sm shadow-black mr-5 w-[40%] ${"placeholder:text-slate-900"}`}
                    />
                  </label>
                </div>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-6 space-y-6"></div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                <Button onClick={handleClose} className="text-xl" variant="primary">
                  Cancelar
                </Button>
                <Button className="text-white text-xl" variant="secondary">
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ModalDatos
