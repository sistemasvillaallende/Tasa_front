import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../base-components/Button"
import { useTasaContext } from "../context/TasaProvider"

const RenderPagination = () => {
  const paginationItems: JSX.Element[] = []
  const pageRange = 5
  const [paginaActual] = useState<number>(1)
  const { pagina, buscarPorURL, parametroURL } = useParams()
  const { cantPaginas } = useTasaContext()
  const navigate = useNavigate()
  let startPage = Math.max(1, paginaActual - pageRange)
  let endPage = Math.min(cantPaginas, paginaActual + pageRange)
  const handlePageChange = (newPage: number) => {
    navigate(`/tasas/${newPage}`)
  }

  if (paginaActual > 1) {
    paginationItems.push(
      <Button
        key="prev"
        variant="primary"
        className="mr-2"
        onClick={() => handlePageChange(paginaActual - 1)}
      >
        &lt;
      </Button>
    )
  }

  if (startPage > 1) {
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
    paginationItems.push(
      <Button
        key={i}
        variant={i === paginaActual ? "primary" : "soft-primary"}
        className="mr-2"
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Button>
    )
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

  if (paginaActual < cantPaginas) {
    paginationItems.push(
      <Button
        key="next"
        variant="primary"
        className="mr-2"
        onClick={() => handlePageChange(paginaActual + 1)}
      >
        &gt;
      </Button>
    )
  }

  return paginationItems
}

export default RenderPagination
