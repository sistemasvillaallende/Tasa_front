import React, { useState } from "react"
import Lucide from "../../../base-components/Lucide"
import Button from "../../../base-components/Button"
import { FormInput } from "../../../base-components/Form"
import { domicilioComercialInputs as inputs } from "../../../utils/defaultInputs"

const ModalCalle = ({
  openModalCalle,
  setOpenModalCalle,
}: {
  openModalCalle: boolean
  setOpenModalCalle: Function
}) => {
  const handleClose = () => {
    setOpenModalCalle(!openModalCalle)
  }
  const [valueRadio, setValueRadio] = useState()
  const handleRadio = (e: any) => {
    e.preventDefault()
    const { value } = e.target
    console.log(value)
    setValueRadio(value)
  }
  return (
    <>
      {openModalCalle && (
        <div className="fixed flex justify-center items-center bg-[#00000090] top-0 left-0 right-0 z-50 w-full overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full scroll-smooth">
          <div className="relative mt-20 w-full max-w-2xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex flex-col items-start justify-between py-4 px-8 border-b rounded-t dark:border-gray-600">
                <button
                  onClick={handleClose}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <Lucide icon="X"></Lucide>
                </button>
                <h3 className="text-xl font-semibold text-danger mb-5">Domicilio Comercial</h3>

                {/* Inputs Checkbox */}
                <label className="text-base mb-10 text-black">
                  <FormInput
                    className="mr-2 shadow-md shadow-[#9DA5B1]"
                    type="checkbox"
                    value={valueRadio}
                    name="domicilioExterno"
                    onClick={handleRadio}
                  />
                  Domicilio Externo
                </label>

                {/* Inputs Text */}
                <div className="w-full flex flex-wrap justify-between gap-5">
                  {inputs.map((input) => (
                    <label key={input.name} className="flex flex-col grow text-black">
                      {input.label}
                      <FormInput
                        type={input.type}
                        placeholder={input.placeholder}
                        className={`shadow-md shadow-[#9DA5B1] h-full px-3 ${
                          input.minWidth == "m"
                            ? "min-w-[20vw]"
                            : input.minWidth == "l"
                            ? "min-w-[30vw]"
                            : input.minWidth == "s"
                            ? "max-w-[9rem]"
                            : ""
                        }`}
                      />
                    </label>
                  ))}
                </div>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-6 space-y-6"></div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                <Button onClick={handleClose} className="text-xl mr-6" variant="primary">
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

export default ModalCalle
