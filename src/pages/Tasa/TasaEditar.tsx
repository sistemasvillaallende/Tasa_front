import { useEffect, useState, useCallback } from "react"
import defaultInputs, { fieldsState } from "../../utils/defaultInputs"
import RenderInputs from "../../components/RenderInputs"
import Button from "../../base-components/Button"
import { useNavigate, useParams } from "react-router-dom"
import { useTasaContext } from "../../context/TasaProvider"
import Swal from "sweetalert2"
import axios from "axios"
import { useUserContext } from "../../context/UserProvider"
import { verFechaActual, verFechaActualConBarras } from "../../utils/helper"

function TasaEditar() {
  const { getInmueble, setInmuebles } = useTasaContext()
  const { user } = useUserContext()
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams()
  const navigate = useNavigate()
  const [detalleInmueble, setDetalleInmueble] = useState<any>(null)
  const [inputs, setInputs] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInmueble = async () => {
      if (!isLoading) return; // Evitar múltiples llamadas si ya se cargaron los datos

      try {
        let inmuebleData;

        // Si tenemos parámetros de nomenclatura, hacemos la petición a la API
        if (circunscripcion) {
          const response = await axios.get(
            `${import.meta.env.VITE_URL_BASE}Inmuebles/getByPk`, {
            params: {
              circunscripcion,
              seccion,
              manzana,
              parcela,
              p_h
            }
          }
          )
          inmuebleData = response.data
        }
        // Si tenemos id, usamos getInmueble
        else if (id && getInmueble) {
          inmuebleData = getInmueble(id)
        }

        if (!inmuebleData) {
          Swal.fire({
            title: "Error",
            text: "No se encontró el inmueble",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
          })
          navigate('/')
          return
        }

        setDetalleInmueble(inmuebleData)
        setInmuebles([inmuebleData])

        // Inicializar inputs con los datos del inmueble
        const newState: any = {}
        fieldsState.forEach((fieldName: string) => {
          newState[fieldName] = inmuebleData[fieldName]
        })
        setInputs(newState)
      } catch (error) {
        console.error('Error al obtener el inmueble:', error)
        Swal.fire({
          title: "Error",
          text: "Error al obtener los datos del inmueble",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        })
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInmueble()
  }, [circunscripcion, seccion, manzana, parcela, p_h, id, getInmueble])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!detalleInmueble) return

    try {
      const requestBody = {
        ...detalleInmueble,
        ...inputs,
        objAuditoria: {
          id_auditoria: 0,
          fecha: verFechaActualConBarras(),
          usuario: user?.userName,
          proceso: "Editar Tasa",
          identificacion: "string",
          autorizaciones: "string",
          observaciones: "string",
          detalle: "string",
          ip: "string",
        },
      }

      await axios.put(`${import.meta.env.VITE_URL_BASE}Inmuebles/Updateinmueble`, requestBody)

      Swal.fire({
        title: "Tasa Actualizada",
        text: "La actualización se ha realizado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })

      navigate(`/detalle/${detalleInmueble.circunscripcion}/${detalleInmueble.seccion}/${detalleInmueble.manzana}/${detalleInmueble.parcela}/${detalleInmueble.p_h}`)
    } catch (error: any) {
      Swal.fire({
        title: error.response?.status ? `${error.response.status}: ${error.response.statusText}` : "Error",
        text: error.message || "Error al actualizar el inmueble",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
      console.error(error)
    }
  }

  const handleCancelar = (e: any) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-20">
      <div className="flex items-center mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">Gestión de Tasa a la Propiedad</h1>
      </div>
      <div className="box py-2">
        <RenderInputs
          list={defaultInputs.casaCentral}
          title="Casa Central"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />
        <RenderInputs
          list={defaultInputs.datosDomicilio}
          title="Datos del Domicilio"
          formInputs={inputs}
          setInputs={setInputs}
        />
        <RenderInputs
          list={defaultInputs.datosLiquidacion}
          title="Datos de Liquidación"
          formInputs={inputs}
          setInputs={setInputs}
          bgSlate
        />
      </div>
      <div className="flex justify-end mr-5 mt-5">
        <Button variant="outline-secondary" className="text-xl" onClick={handleCancelar}>
          Cancelar
        </Button>
        <Button variant="primary" className="ml-8 text-white text-xl" type="submit">
          Confirmar
        </Button>
      </div>
    </form>
  )
}

export default TasaEditar
