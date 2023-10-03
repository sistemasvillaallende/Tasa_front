import { useState } from "react"
import Lucide from "../../base-components/Lucide"
import { FormInput, FormLabel } from "../../base-components/Form"
import Button from "../../base-components/Button"
import Table from "../../base-components/Table"
import { useParams, useNavigate } from "react-router-dom"
import TableConstructor from "../../components/TableConstructor"
import RenderPagination from "../../components/RenderPagination"
import SearchBar from "../../components/SearchBar"

const fields = [
  { name: "Nro BADEC" },
  { name: "Nombre" },
  { name: "CUIT" },
  { name: "Calle Frente" },
  { name: "Nro" },
  { name: "Barrio" },
  { name: "Acciones" },
]

const data = [
  {
    "Nro BADEC": 38658,
    Nombre: "Arias Agapito Aurelio",
    CUIT: 20351598647,
    "Calle Frente": "Matadero",
    Nro: 410,
    Barrio: "Las Polinesias",
  },
  {
    "Nro BADEC": 38659,
    Nombre: "Lopez Maria",
    CUIT: 20351234567,
    "Calle Frente": "Calle Principal",
    Nro: 123,
    Barrio: "Los Pinos",
  },
  {
    "Nro BADEC": 38659,
    Nombre: "Gonzalez Juan",
    CUIT: 20352345678,
    "Calle Frente": "Avenida Central",
    Nro: 789,
    Barrio: "El Rosario",
  },
  {
    "Nro BADEC": 38658,
    Nombre: "Arias Agapito Aurelio",
    CUIT: 20351538647,
    "Calle Frente": "Matadero",
    Nro: 410,
    Barrio: "Las Polinesias",
  },
  {
    "Nro BADEC": 38659,
    Nombre: "Lopez Maria",
    CUIT: 20357234567,
    "Calle Frente": "Calle Principal",
    Nro: 123,
    Barrio: "Los Pinos",
  },
]

interface Contribuyente {
  nombre: string
  apellido: string
  cuit: string
  direccion: string
  telefono: string
  email: string
}

const Tasas = () => {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [cuit, setCuit] = useState("")
  const [searchResult, setSearchResult] = useState<Contribuyente | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSearch = () => {
    const cuitRegex = /^\d{11}$/

    if (cuit) {
      if (!cuitRegex.test(cuit)) {
        setError("El CUIT debe tener 11 dígitos numéricos.")
        return
      }

      const result: Contribuyente = {
        nombre: "",
        apellido: "",
        cuit: cuit,
        direccion: "Av. Siempre Viva 123",
        telefono: "555-1234",
        email: "juan.perez@example.com",
      }

      setSearchResult(result)
      setError(null)
    } else if (nombre) {
      if (nombre.length < 3) {
        setError("El nombre debe tener al menos 3 caracteres.")
        return
      }

      const result: Contribuyente = {
        nombre: nombre,
        apellido: "Perez",
        cuit: "20351598647",
        direccion: "Av. Siempre Viva 123",
        telefono: "555-1234",
        email: "juan.perez@example.com",
      }

      setSearchResult(result)
      setError(null)
    } else {
      setError("Debe ingresar un nombre o un CUIT.")
    }
  }

  const handleVerContribuyente = () => {
    navigate("/detalle")
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
        <SearchBar />
        <div className="conScroll h-2/5">
          {data.length > 0 && (
            <TableConstructor fields={fields} data={data} action={handleVerContribuyente} />
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
