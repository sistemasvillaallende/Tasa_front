import React, { useState } from "react"
import Button from "../base-components/Button"
import { FormInput, FormLabel, FormSelect } from "../base-components/Form"
import Swal from "sweetalert2"
import { useTasaContext } from "../context/TasaProvider"
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const SearchBar = ({
  handleNuevaTasa,
}: {
  handleNuevaTasa: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const { setInmuebles, setCantPaginas, searchForm, setSearch, showConceptos, setShowConceptos } = useTasaContext()
  const { buscarPor, searchParametro, denominacion, activos } = searchForm
  const { cir, sec, man, p_h, par } = denominacion

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
    if (buscarPor != "denominacion" && (!buscarPor || !searchParametro || buscarPor === "0")) {
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
      const paginaNum = 1
      setPaginaActual(paginaNum)
      let URL
      if (buscarPor === "denominacion") {
        URL = `${import.meta.env.VITE_URL_BASE
          }Inmuebles/GetInmueblesPaginadoDenominacion?circunscripcion=${cir}&seccion=${sec}&manzana=${man}&parcela=${par}&p_h=${p_h}`
      } else {
        URL = `${import.meta.env.VITE_URL_BASE
          }Inmuebles/GetInmueblesPaginado?buscarPor=${buscarPor}&strParametro=${searchParametro}&pagina=${paginaNum}&registros_por_pagina=${registrosPorPagina}`
      }

      const response = await axios.get(URL)
      setCantPaginas(response.data.totalPaginas)
      setSearch({ ...searchForm, pagina: response.data.paginaActual })
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
  }

  const handleChangeDenominacion = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const target = e.target
    const { value, name } = target
    setSearch({ ...searchForm, denominacion: { ...searchForm.denominacion, [name]: value } })
  }



  const toggleConceptos = () => {
    setShowConceptos(!showConceptos)
    // Limpiar el formulario de búsqueda cuando cambiamos a vista de conceptos
    if (!showConceptos) {
      setSearch({
        ...searchForm,
        searchParametro: "",
        denominacion: {
          cir: 0,
          sec: 0,
          man: 0,
          par: 0,
          p_h: 0,
        },
      })
    }
  }

  return (
    <div className="mb-5">
      <div className="flex justify-start items-center">
        <form
          id="formBuscar"
          className="ml-1 flex flex-col justify-start items-center gap-2"
          onSubmit={handleSubmit}
        >
          <div className="flex">
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
                <option value="cuil">CUIT</option>
                <option value="denominacion">Denominación</option>
              </FormSelect>

              {/*
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
              */}

              <FormInput
                type="text"
                className="mr-5 ml-5 border-transparent w-56 shadow-none rounded-5 pr-8 bg-gray-100"
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



            <Button
              variant={showConceptos ? "primary" : "soft-primary"}
              className="h-10 mx-3"
              onClick={toggleConceptos}
              type="button"
            >
              {showConceptos ? "Ver Búsqueda" : "Ver Conceptos"}
            </Button>
          </div>
          {buscarPor === "denominacion" && (
            <div className="self-start intro-y">
              <FormLabel>
                Circunscripcion
                <FormInput
                  className="mx-5 mt-2 w-12"
                  placeholder="00"
                  value={cir}
                  name="cir"
                  type="number"
                  onChange={handleChangeDenominacion}
                />
              </FormLabel>
              <FormLabel>
                Sección
                <FormInput
                  className="mx-5 mt-2 w-12"
                  placeholder="00"
                  type="number"
                  value={sec}
                  name="sec"
                  onChange={handleChangeDenominacion}
                />
              </FormLabel>
              <FormLabel>
                Manzana
                <FormInput
                  className="mx-5 mt-2 w-12"
                  placeholder="00"
                  type="number"
                  value={man}
                  name="man"
                  onChange={handleChangeDenominacion}
                />
              </FormLabel>
              <FormLabel>
                Parcela
                <FormInput
                  className="mx-5 mt-2 w-12"
                  placeholder="00"
                  type="number"
                  value={par}
                  name="par"
                  onChange={handleChangeDenominacion}
                />
              </FormLabel>
              <FormLabel>
                PH
                <FormInput
                  className="mx-5 mt-2 w-12"
                  placeholder="00"
                  type="number"
                  value={p_h}
                  name="p_h"
                  onChange={handleChangeDenominacion}
                />
              </FormLabel>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default SearchBar
