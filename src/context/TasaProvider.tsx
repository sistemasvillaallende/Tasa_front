import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Inmueble } from "../interfaces/Tasa"
import { useLocation } from "react-router-dom"

type TasaContextType = {
  inmuebles: Inmueble[] | null
  traerInmuebles: any
  setInmuebles: (tasa: Inmueble) => void
  setCantPaginas: (nroPagina: number) => void
  cantPaginas: number
  searchForm: any
  setSearch: Function
}

const TasaContext = createContext<TasaContextType>({
  inmuebles: null,
  traerInmuebles: () => {},
  setInmuebles: () => {},
  setCantPaginas: () => {},
  cantPaginas: 0,
  searchForm: {},
  setSearch: () => {},
})

export function useTasaContext() {
  return useContext(TasaContext)
}

export function TasaProvider({ children }: any) {
  const [inmuebles, setInmuebles] = useState<Inmueble | null>(null)
  const [cantPaginas, setCantPaginas] = useState(1)
  const [searchForm, setSearch] = useState({
    buscarPor: "titular",
    searchParametro: "",
    pagina: "",
    registrosPorPagina: "",
    activos: 1,
  })
  const location = useLocation()
  useEffect(() => {
    !inmuebles &&
      searchForm.searchParametro != "" &&
      traerInmuebles(
        searchForm.buscarPor,
        searchForm.searchParametro,
        searchForm.pagina,
        searchForm.registrosPorPagina
      )
    console.log("cambio la url")
  }, [location.pathname])
  const traerInmuebles = async (
    buscarPor: string,
    parametro: string,
    pagina: string,
    registrosPorPagina: string
  ) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL_TASA
        }GetInmueblesPaginado?buscarPor=${buscarPor}&strParametro=${parametro}&pagina=${pagina}&registros_por_pagina=${registrosPorPagina}`
      )
      setInmuebles(response.data)
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al buscar el inmueble",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
    }
  }

  return (
    <TasaContext.Provider
      value={{
        traerInmuebles,
        inmuebles,
        setInmuebles,
        cantPaginas,
        setCantPaginas,
        searchForm,
        setSearch,
      }}
    >
      {children}
    </TasaContext.Provider>
  )
}
