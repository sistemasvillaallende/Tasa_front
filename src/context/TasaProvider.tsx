import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Inmueble } from "../interfaces/Inmueble"
import { useLocation, useParams } from "react-router-dom"

type TasaContextType = {
  inmuebles: Inmueble[] | null
  getInmueble: Function
  traerInmuebles: any
  setInmuebles: Dispatch<SetStateAction<Inmueble[] | null>>
  setCantPaginas: (nroPagina: number) => void
  cantPaginas: number
  searchForm: any
  setSearch: Function
}

const TasaContext = createContext<TasaContextType>({
  inmuebles: null,
  getInmueble: () => {},
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
  const [inmuebles, setInmuebles] = useState<Inmueble[] | null>(null)
  const [cantPaginas, setCantPaginas] = useState<number>(0)
  const [searchForm, setSearch] = useState({
    buscarPor: "titular",
    searchParametro: "",
    pagina: 0,
    registrosPorPagina: 10,
    activos: 1,
    denominacion: {
      cir: 0,
      sec: 0,
      man: 0,
      par: 0,
      p_h: 0,
    },
  })

  const getInmueble = (id: string) => {
    return inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id)
  }
  useEffect(() => {
    !inmuebles &&
      searchForm.searchParametro != "" &&
      traerInmuebles(
        searchForm.buscarPor,
        searchForm.searchParametro,
        searchForm.pagina,
        searchForm.registrosPorPagina
      )
  }, [location])

  const traerInmuebles = async (
    buscarPor: string,
    parametro: string,
    pagina: number,
    registrosPorPagina: number
  ) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL_TASA
        }GetInmueblesPaginado?buscarPor=${buscarPor}&strParametro=${parametro}&pagina=${pagina}&registros_por_pagina=${registrosPorPagina}`
      )
      setInmuebles(response.data)
      setCantPaginas(response.data.totalPaginas)
      setSearch({ ...searchForm, pagina: response.data.paginaActual })
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
        getInmueble,
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
