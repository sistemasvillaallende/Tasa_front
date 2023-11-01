import { useParams, useNavigate } from "react-router-dom"
import TableConstructor from "../../components/TableConstructor"
import RenderPagination from "../../components/RenderPagination"
import SearchBar from "../../components/SearchBar"
import { useTasaContext } from "../../context/TasaProvider"

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
  const { inmuebles } = useTasaContext()
  const handleNuevaTasa = () => {
    navigate(`/nuevaTasa`)
  }

  const handleVerContribuyente = (inmueble: any) => {
    navigate(`detalle/${inmueble.nro_bad}`)
  }

  return (
    <>
      <div className="intro-y flex flex-col h-full">
        {/* <section>
            <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
              <h2 className="text-lg font-medium">Buscar Persona</h2>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 intro-y lg:col-span-4">
                <FormLabel htmlFor="nombre">Nombre, Apellido o Razón Social</FormLabel>
                <FormInput
                  id="nombre"
                  type="text"
                  placeholder="Razón Social"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="col-span-12 intro-y lg:col-span-3">
                <FormLabel className="ml-4" htmlFor="cuit">
                  CUIT:
                </FormLabel>
                <FormInput
                  id="cuit"
                  type="text"
                  placeholder="Ingrese el CUIT"
                  value={cuit}
                  onChange={(e) => setCuit(e.target.value)}
                />
              </div>
              <div className="col-span-12 intro-y lg:col-span-1">
                <Button onClick={handleSearch} className="ml-2 mt-7">
                  Buscar
                </Button>
              </div>
              <div className="col-span-12 intro-y lg:col-span-12">
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
              <div className="col-span-12 intro-y lg:col-span-12">
                {searchResult && (
                  <div className="mt-4">
                    <h3>Resultado de la búsqueda:</h3>
                    <p>
                      Nombre: {searchResult.nombre} {searchResult.apellido}
                    </p>
                    <p>CUIT: {searchResult.cuit}</p>
                    <p>Dirección: {searchResult.direccion}</p>
                    <p>Teléfono: {searchResult.telefono}</p>
                    <p>Email: {searchResult.email}</p>
                    <Button onClick={handleVerContribuyente} className="ml-2 mt-7">
                      Ver Tasas
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section> */}
        <SearchBar handleNuevaTasa={handleNuevaTasa} />
        <div className="conScroll h-2/5">
          {inmuebles && inmuebles.length > 0 && (
            <TableConstructor
              fields={fields}
              data={inmuebles}
              handleClick={handleVerContribuyente}
            />
          )}
        </div>
      </div>
      <div className="absolute right-0 -bottom-16">
        <RenderPagination />
      </div>
    </>
  )
}

export default Tasas
