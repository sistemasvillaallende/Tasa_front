import Button from "../base-components/Button"
import { useTasaContext } from "../context/TasaProvider"
import axios from "axios"
import Swal from "sweetalert2"

const RenderPagination = () => {
  const paginationItems: JSX.Element[] = []
  const pageRange = 5
  const { cantPaginas, searchForm, setInmuebles, setCantPaginas, setSearch } = useTasaContext()

  const { buscarPor, searchParametro, activos, pagina, registrosPorPagina } = searchForm

  let startPage = Math.max(1, pagina - pageRange)

  let endPage = Math.min(cantPaginas, pagina + pageRange)

  const handlePageChange = (newPage: number) => {
    const paginaNum = newPage
    setSearch({ ...searchForm, pagina: paginaNum })

    if (buscarPor && searchParametro) {
      const fetchData = async () => {
        const URL = `${import.meta.env.VITE_URL_BASE
          }Inmuebles/GetInmueblesPaginado?buscarPor=${buscarPor}&strParametro=${searchParametro}&activo=${activos}&pagina=${newPage}&registros_por_pagina=${registrosPorPagina}`
        const response = await axios.get(URL)
        if (response.data === "") {
          Swal.fire({
            title: "Error",
            text: "Al parecer ya no hay páginas.",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          })

          return
        }
        setInmuebles(response.data.resultado)
        setCantPaginas(response.data.totalPaginas)
        setCantPaginas(response.data.totalPaginas)
      }

      fetchData()
    }
  }

  if (pagina > 1) {
    paginationItems.push(
      <Button
        key="prev"
        variant="primary"
        className="mr-2"
        onClick={() => handlePageChange(pagina - 1)}
      >
        &lt;
      </Button>
    )
  }
  if (cantPaginas > 1 && startPage > 1) {
    paginationItems.push(
      <Button key={1} variant="soft-primary" className="mr-2" onClick={() => handlePageChange(1)}>
        1
      </Button>
    )

    if (startPage > 2) {
      paginationItems.push(
        <span key="ellipsis-prev" className="mr-2">
          ...
        </span>
      )
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    if (cantPaginas > 1) {
      paginationItems.push(
        <Button
          key={i}
          variant={i === pagina ? "primary" : "soft-primary"}
          className="mr-2"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      )
    }
  }

  if (endPage < cantPaginas) {
    if (endPage < cantPaginas - 1) {
      paginationItems.push(
        <span key="ellipsis-next" className="mr-2">
          ...
        </span>
      )
    }

    paginationItems.push(
      <Button
        key={cantPaginas}
        variant="soft-primary"
        className="mr-2"
        onClick={() => handlePageChange(cantPaginas)}
      >
        {cantPaginas}
      </Button>
    )
  }

  if (pagina < cantPaginas) {
    paginationItems.push(
      <Button
        key="next"
        variant="primary"
        className="mr-2"
        onClick={() => handlePageChange(pagina + 1)}
      >
        &gt;
      </Button>
    )
  }

  return paginationItems
}

export default RenderPagination
