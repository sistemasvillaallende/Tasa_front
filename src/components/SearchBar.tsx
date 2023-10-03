import React from "react"
import Button from "../base-components/Button"
import { FormInput, FormLabel, FormSelect } from "../base-components/Form"

const SearchBar = () => {
  return (
    <div className="mb-5">
      <div className="flex w-full justify-between items-center intro-y">
        <div className="flex justify-start">
          <form
            id="formBuscar"
            className="ml-1 flex justify-start items-center"
            // onSubmit={handleBuscar}
          >
            <div className="relative hidden sm:block">
              <FormLabel htmlFor="vertical-form-1">Buscar por</FormLabel>
              <FormSelect
                className="ml-3 sm:mr-2 w-100"
                name="buscarPor"
                id="buscarPor"
                // value={buscarPor}
                // onChange={(e) => setBuscarPor(e.target.value)}
              >
                <option value="">- Parametro -</option>
                <option value="dominio">Dominio</option>
                <option value="cuit">CUIT</option>
                <option value="titular">Titular</option>
              </FormSelect>
              <FormLabel htmlFor="vertical-form-1">y ver</FormLabel>
              <FormSelect
                className="ml-3 sm:mr-2 w-100"
                name="activos"
                id="activos"
                // value={activos}
                // onChange={(e) => setActivos(e.target.value)}
              >
                <option value="1">activos</option>
                <option value="0">inactivos</option>
              </FormSelect>
              <FormInput
                type="text"
                className="mr-5 border-transparent w-56 shadow-none rounded-5 pr-8"
                placeholder="Buscar..."
                // value={strParametro}
                // onChange={(e) => setStrParametro(e.target.value)}
                name="parametro"
                id="parametro"
              />
            </div>
            <Button variant="primary" className="h-10 mx-3">
              Buscar
            </Button>
          </form>
          <Button
            variant="soft-primary"
            className="h-10 mx-3"
            // onClick={handleLimpiar}
          >
            Limpiar
          </Button>
        </div>
        <Button
          variant="primary"
          className="h-10 mx-4"
          // onClick={handleNuevoVehiculo}
        >
          Nueva Tasa
        </Button>
      </div>
    </div>
  )
}

export default SearchBar
