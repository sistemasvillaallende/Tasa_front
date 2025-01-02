import { useNavigate } from "react-router-dom"
import TableConstructor from "../../components/TableConstructor"
import RenderPagination from "../../components/RenderPagination"
import SearchBar from "../../components/SearchBar"
import { useTasaContext } from "../../context/TasaProvider"
import PorConceptos from "../../pages/PorConceptos/PorConceptos"

const fields = [
  {
    name: "Propietario",
    fieldsArray: [
      { fieldName: "nombre", frontName: "Nombre" },
      { fieldName: "cuil", frontName: "Cuil" },
    ],
  },
  {
    name: "Inmueble",
    fieldsArray: [
      { fieldName: "nom_calle_dom_esp", frontName: "Calle" },
      { fieldName: "nro_dom_esp", frontName: "Nro" },
      { fieldName: "nom_barrio_dom_esp", frontName: "Barrio" },
    ],
  },
  { name: "Estado", field: "cuil" },
  { name: "Último periodo de liquidación", field: "nom_barrio_dom_esp" },
  { name: "Situación", field: "cod_situacion_judicial" },
  { name: "Saldo", field: "saldo_adeudado" },
  { name: "Multas", field: "con_deuda" },
  { name: "Acciones", field: "" },
]

const Tasas = () => {
  const navigate = useNavigate()
  const { inmuebles, searchForm, showConceptos } = useTasaContext()

  const handleNuevaTasa = () => {
    navigate(`/nuevaTasa`)
  }

  const handleVerContribuyente = (inmueble: any) => {
    console.log(inmueble)
    navigate(`detalle/${inmueble.nro_bad}`)
  }

  const hasSearchResults =
    searchForm.searchParametro !== "" ||
    (searchForm.buscarPor === "denominacion" &&
      Object.values(searchForm.denominacion).some(value => value !== 0))

  return (
    <div className="mb-16">
      <div className="flex flex-col h-full bg-white pt-5">
        <SearchBar handleNuevaTasa={handleNuevaTasa} />
        <div className="conScroll h-full pb-24">
          {showConceptos ? (
            <PorConceptos />
          ) : (
            hasSearchResults && inmuebles && inmuebles.length > 0 && (
              <>
                <TableConstructor
                  fields={fields}
                  data={inmuebles}
                  handleClick={handleVerContribuyente}
                />
                <div className="absolute right-0 mt-3 mb-5">
                  <RenderPagination />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasas
