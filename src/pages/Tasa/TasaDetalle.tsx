import defaultInputs from "../../utils/defaultInputs"
import RenderTexts from "../../components/RenderTexts"
import { useParams } from "react-router-dom"
import { useTasaContext } from "../../context/TasaProvider"
import { useEffect, useState } from "react"
import { Inmueble } from "../../interfaces/Inmueble"
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material"
import axios from "axios"
import Swal from "sweetalert2"

function TasaDetalle() {
  const params = useParams()
  const { inmuebles, setInmuebles } = useTasaContext()
  const [detalleInmueble, setDetalleInmueble] = useState<Inmueble | undefined>()
  const [openDialog, setOpenDialog] = useState(false)
  const [observaciones, setObservaciones] = useState("")

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        // Si tenemos id, buscamos en inmuebles
        if (params.id) {
          const inmueble = inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === params.id)
          if (inmueble) {
            setDetalleInmueble(inmueble)
            return
          }
        }
        // Si tenemos los parámetros de nomenclatura, hacemos la petición a la API
        else if (params.circunscripcion) {
          const response = await axios.get(
            `${import.meta.env.VITE_URL_BASE}Inmuebles/getByPk`, {
            params: {
              circunscripcion: params.circunscripcion,
              seccion: params.seccion,
              manzana: params.manzana,
              parcela: params.parcela,
              p_h: params.p_h
            }
          }
          )
          setDetalleInmueble(response.data)
          // Actualizamos el contexto con el nuevo inmueble
          setInmuebles([response.data])
          return
        }

        // Si no encontramos el inmueble, redirigimos al inicio
        window.location.href = "/"
      } catch (error) {
        console.error('Error al obtener el inmueble:', error)
        Swal.fire({
          title: "Error",
          text: "Error al obtener los datos del inmueble",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        })
        window.location.href = "/"
      }
    }

    fetchInmueble()
  }, [params])

  const getUserFromCookie = () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('VABack.CIDI='))

    if (cookie) {
      const decodedValue = decodeURIComponent(cookie.split('=')[1])
      const nombreUsuario = decodedValue.match(/nombre_usuario=([^&\s]+)/)?.[1]
      return nombreUsuario?.trim() || 'MVELEZ'
    }
    return 'MVELEZ'
  }

  const handleBajaInmueble = async () => {
    if (!detalleInmueble) return

    try {
      const usuario = getUserFromCookie()
      const now = new Date().toISOString()

      // Asegurarnos que los parámetros sean números
      const params = {
        cir: Number(detalleInmueble.circunscripcion),
        sec: Number(detalleInmueble.seccion),
        man: Number(detalleInmueble.manzana),
        par: Number(detalleInmueble.parcela),
        p_h: Number(detalleInmueble.p_h)
      }

      const auditoria = {
        id_auditoria: 0,
        fecha: now,
        usuario: usuario,
        proceso: "string",
        identificacion: "string",
        autorizaciones: "string",
        observaciones: observaciones || "string",
        detalle: "string",
        ip: "string"
      }

      console.log('Enviando request:', {
        params,
        auditoria
      })

      const response = await axios({
        method: 'DELETE',
        url: `${import.meta.env.VITE_URL_BASE}Inmuebles/BajaInmueble`,
        params: params,
        data: auditoria,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        Swal.fire({
          title: "Éxito",
          text: "Inmueble dado de baja correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        }).then(() => {
          window.location.href = "/"
        })
      }

    } catch (error: any) {
      console.error('Error al dar de baja el inmueble:', error)
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al dar de baja el inmueble",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
    }
    setOpenDialog(false)
  }

  return (
    <form className="mb-10">
      <div className="flex items-center justify-between mt-8 intro-y">
        <h1 className="mr-auto ml-5 mb-3 text-lg font-medium">
          Gestión de Tasa a la Propiedad
        </h1>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenDialog(true)}
          className="mr-5"
        >
          Dar de Baja Inmueble
        </Button>
      </div>

      <div className="box py-2">
        {/* Datos del propietadio */}
        <RenderTexts
          data={detalleInmueble}
          list={defaultInputs.casaCentral}
          title="Datos del propietario"
          bgSlate
        />
        {/* Datos de domicilio */}
        <RenderTexts
          data={detalleInmueble}
          list={defaultInputs.datosDomicilio}
          title="Datos del Domicilio"
        />
        {/* Datos de liquidación */}
        <RenderTexts
          data={detalleInmueble}
          list={defaultInputs.datosLiquidacion}
          title="Datos de Liquidación"
          bgSlate
        />{" "}
        {/* Footer */}
        <RenderTexts data={detalleInmueble} list={defaultInputs.footer} />{" "}
      </div>

      {/* Dialog para confirmar baja */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Dar de Baja Inmueble</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <TextField
              label="Observaciones"
              multiline
              rows={4}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleBajaInmueble}
            variant="contained"
            color="error"
          >
            Confirmar Baja
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default TasaDetalle
