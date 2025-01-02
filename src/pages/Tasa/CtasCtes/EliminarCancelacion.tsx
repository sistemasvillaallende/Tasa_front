import { useEffect, useState } from "react"
import { useTasaContext } from "../../../context/TasaProvider"
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import { useUserContext } from "../../../context/UserProvider"
import { formatNumberToARS } from "../../../utils/Operaciones"
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Checkbox,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const EliminarCancelacion = () => {
  const { inmuebles } = useTasaContext()
  const { id } = useParams()
  const detalleInmueble = inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id)
  const { circunscripcion, seccion, manzana, p_h, parcela } = detalleInmueble ?? {
    circunscripcion: "",
    parcela: "",
    seccion: "",
    manzana: "",
    p_h: "",
  }
  const [reLiquidaciones, setReLiquidaciones] = useState<ReLiquidacion[]>([])
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<ReLiquidacion[]>([])
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/Listar_Periodos_cancelados?cir=${circunscripcion}&sec=${seccion}&man=${manzana}&par=${parcela}&p_h=${p_h}`
    axios.get(apiUrl)
      .then((response) => {
        setReLiquidaciones(response.data)
      })
      .catch((error) => {
        Swal.fire({
          title: `${error.response.data.message}`,
          icon: "warning",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
          position: 'top',
          customClass: {
            container: 'position-absolute'
          }
        })
      })
  }, [])

  const handleSeleccionar = (e: ReLiquidacion) => {
    const reLiquidacionSeleccionada = reLiquidacionesSeleccionadas.find(
      (reLiquidacion) => reLiquidacion.periodo === e.periodo
    )
    if (reLiquidacionSeleccionada) {
      const reLiquidacionesFiltradas = reLiquidacionesSeleccionadas.filter(
        (reLiquidacion) => reLiquidacion.periodo !== e.periodo
      )
      setReLiquidacionesSeleccionadas(reLiquidacionesFiltradas)
    } else {
      setReLiquidacionesSeleccionadas([...reLiquidacionesSeleccionadas, e])
    }
  }

  const handleSeleccionarTodo = () => {
    if (reLiquidacionesSeleccionadas.length === reLiquidaciones.length) {
      setReLiquidacionesSeleccionadas([])
    } else {
      setReLiquidacionesSeleccionadas([...reLiquidaciones])
    }
  }

  const verFechaActual = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0") // Sumamos 1 ya que en JavaScript los meses comienzan en 0
    const day = String(currentDate.getDate()).padStart(2, "0")
    const hours = String(currentDate.getHours()).padStart(2, "0")
    const minutes = String(currentDate.getMinutes()).padStart(2, "0")
    const seconds = String(currentDate.getSeconds()).padStart(2, "0")
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, "0")
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
    return formattedDate
  }

  const handleCancelarCtaCte = (auditoria: string) => {
    const consulta = {
      cir: circunscripcion,
      sec: seccion,
      man: manzana,
      par: parcela,
      p_h: p_h,
      lstCtasTes: reLiquidacionesSeleccionadas,
      auditoria: {
        id_auditoria: 0,
        fecha: verFechaActual(),
        usuario: user?.userName,
        proceso: "Eliminar cancelación",
        identificacion: "string",
        autorizaciones: "string",
        observaciones: auditoria,
        detalle: "string",
        ip: "string",
      },
    }
    const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/Confirma_elimina_cancelacion`
    axios
      .post(apiUrl, consulta)
      .then((response) => {
        Swal.fire({
          title: "Eliminación de Cancelación",
          text: "Se ha eliminado las cancelaciones de los periodos seleccionados.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
          position: 'top',
          customClass: {
            container: 'position-absolute'
          }
        })
        setReLiquidacionesSeleccionadas([])
        navigate(`/detalle/${detalleInmueble?.nro_bad}/`)
      })
      .catch((error) => {
        Swal.fire({
          title: `${error.response.status}: ${error.response.statusText}`,
          text: error.message,
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
          position: 'top',
          customClass: {
            container: 'position-absolute'
          }
        })
      })
  }

  const handleAuditoria = async () => {
    const { value } = await Swal.fire({
      title: "Autorización",
      input: "textarea",
      inputPlaceholder: "Observaciones",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#27a3cf",
      position: 'top',
      customClass: {
        container: 'position-absolute'
      }
    })

    if (value) {
      handleCancelarCtaCte(value)
    }
  }

  const handleCancelar = () => {
    setReLiquidacionesSeleccionadas([])
    navigate(`/detalle/${detalleInmueble?.nro_bad}/`)
  }

  const sumarMontosSeleccionados = () => {
    const total = reLiquidacionesSeleccionadas.reduce((accumulator, liquidacion) => {
      return accumulator + liquidacion.monto_original
    }, 0)

    return total
  }

  return (
    <Box sx={{ mt: '15px', mb: '35px', mx: '5px' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
          Revertir Cancelación Especial de Periodos en la Cuenta Corriente
        </Typography>

        <Grid container spacing={3}>
          {/* Primera tabla */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Periodos Cancelados
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={handleSeleccionarTodo}
                          checked={reLiquidacionesSeleccionadas.length === reLiquidaciones.length}
                          indeterminate={reLiquidacionesSeleccionadas.length > 0 &&
                            reLiquidacionesSeleccionadas.length < reLiquidaciones.length}
                        />
                      </TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell align="right">Debe</TableCell>
                      <TableCell align="right">Nro Trans</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reLiquidaciones.map((liquidacion, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                            onChange={() => handleSeleccionar(liquidacion)}
                          />
                        </TableCell>
                        <TableCell>{liquidacion.periodo}</TableCell>
                        <TableCell align="right">{formatNumberToARS(liquidacion.debe)}</TableCell>
                        <TableCell align="right">{liquidacion.nro_transaccion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Segunda tabla */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Periodos a Revertir
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Acción</TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell align="right">Debe</TableCell>
                      <TableCell align="right">Nro Trans</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reLiquidacionesSeleccionadas.map((liquidacion, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleSeleccionar(liquidacion)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>{liquidacion.periodo}</TableCell>
                        <TableCell align="right">
                          {formatNumberToARS(liquidacion.monto_original)}
                        </TableCell>
                        <TableCell align="right">{liquidacion.nro_transaccion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Botones de acción */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleAuditoria}
                disabled={reLiquidacionesSeleccionadas.length === 0}
              >
                Confirmar
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default EliminarCancelacion
