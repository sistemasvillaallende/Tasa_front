import React, { useState } from "react"
import Button from "../base-components/Button"
import { FormInput, FormLabel, FormSelect } from "../base-components/Form"
import Swal from "sweetalert2"
import { useTasaContext } from "../context/TasaProvider"
import axios from "axios"

const SearchBar = ({
  handleNuevaTasa,
}: {
  handleNuevaTasa: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const [error, setError] = useState<string | null>(null)
  const [paginaActual, setPaginaActual] = useState(1)

  const { setInmuebles, setCantPaginas, searchForm, setSearch } = useTasaContext()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setSearch({ ...searchForm, [id]: value })
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target
    setSearch({ ...searchForm, [id]: value })
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { buscarPor, searchParametro, activos } = searchForm
    if (!buscarPor || !searchParametro || buscarPor === "0") {
      Swal.fire({
        title: "Faltan parámetros o criterios de búsqueda",
        text: "Por favor, ingrese criterios de búsqueda válidos.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
      return
    }

    const fetchData = async () => {
      const registrosPorPagina = 10
      const paginaNum = 0
      setPaginaActual(paginaNum)
      const URL = `${
        import.meta.env.VITE_URL_TASA
      }GetInmueblesPaginado?buscarPor=${buscarPor}&strParametro=${searchParametro}&pagina=${paginaNum}&registros_por_pagina=${registrosPorPagina}`
      const response = await axios.get(URL)
      setCantPaginas(response.data.totalPaginas)
      setInmuebles(response.data.resultado)
      if (response.status === 204) {
        Swal.fire({
          title: "Sin resultados",
          text: "ERROR 204: La consulta no tuvo resultado.",
          icon: "error",
          confirmButtonColor: "#27a3cf",
        })
        return
      }
      setError(null)
    }
    fetchData()
    // }
    // else {
    //   setError("Debe ingresar un nombre o un CUIT.")
    // }
  }

  const handleLimpiar = () => {
    window.location.href = "/"
  }
  return (
    <div className="mb-5">
      <div className="flex w-full justify-between items-center intro-y">
        <div className="flex justify-start items-center">
          <form
            id="formBuscar"
            className="ml-1 flex justify-start items-center"
            onSubmit={handleSubmit}
          >
            <div className="relative hidden sm:block">
              <FormLabel htmlFor="vertical-form-1">Buscar por</FormLabel>
              <FormSelect
                className="ml-3 sm:mr-2 w-100"
                name="buscarPor"
                id="buscarPor"
                value={searchForm.buscarPor}
                onChange={(e) => handleSelectChange(e)}
              >
                <option value="titular">Titutlar</option>
                <option value="cuit">CUIT</option>
                <option value="badec">Badec</option>
              </FormSelect>
              <FormLabel htmlFor="vertical-form-1">Estado</FormLabel>
              <FormSelect
                className="ml-3 sm:mr-2 w-100"
                name="activos"
                id="activos"
                value={searchForm.activos}
                onChange={(e) => handleSelectChange(e)}
              >
                <option value="1">activos</option>
                <option value="0">inactivos</option>
              </FormSelect>
              <FormInput
                type="text"
                className="mr-5 mt-2 border-transparent w-56 shadow-none rounded-5 pr-8"
                placeholder="Buscar..."
                value={searchForm.searchParametro}
                onChange={(e) => handleChange(e)}
                name="parametro"
                id="searchParametro"
              />
            </div>
            <Button variant="primary" className="h-10 mx-3">
              Buscar
            </Button>
          </form>
          <Button variant="soft-primary" className="h-10 mx-3" onClick={handleLimpiar}>
            Limpiar
          </Button>
        </div>
        <Button variant="primary" className="h-10 mx-4" onClick={handleNuevaTasa}>
          Nueva Tasa
        </Button>
      </div>
    </div>
  )
}

export default SearchBar
