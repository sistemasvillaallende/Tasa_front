import { useEffect, useState } from "react"
import { useTasaContext } from "../../../context/TasaProvider"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useUserContext } from "../../../context/UserProvider"
import { formatNumberToARS } from "../../../utils/Operaciones"
import { verFechaActual } from "../../../utils/helper"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import Swal from 'sweetalert2'

const CancelarCtaCte = () => {
  const [reLiquidaciones, setReLiquidaciones] = useState<any[]>([])
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<any[]>([])
  const [motivo, setMotivo] = useState<number>(0)
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { id } = useParams()
  const { inmuebles } = useTasaContext()
  const detalleInmueble = inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id)
  const { circunscripcion, seccion, manzana, p_h, parcela } = detalleInmueble ?? {
    circunscripcion: "",
    parcela: "",
    seccion: "",
    manzana: "",
    p_h: "",
  }
  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_URL_CTACTE
      }Listar_periodos_a_cancelar?cir=${circunscripcion}&sec=${seccion}&man=${manzana}&par=${parcela}&p_h=${p_h}`
    axios
      .get(apiUrl)
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

  const handleSeleccionar = (e: any) => {
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
        proceso: "Reliquidación de deuda",
        identificacion: "string",
        autorizaciones: "string",
        observaciones: auditoria,
        detalle: "string",
        ip: "string",
      },
    }
    const apiUrl = `${import.meta.env.VITE_URL_BASE
      }Ctasctes_inmuebles/Confirma_cancelacion_ctasctes?tipo_transaccion=${motivo}`
    axios
      .post(apiUrl, consulta)
      .then((response) => {
        Swal.fire({
          title: "Cancelación realizada",
          text: "Se ha cancelado correctamente los periodos seleccionados.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
          position: 'top',
          customClass: {
            container: 'position-absolute'
          }
        })
        setReLiquidacionesSeleccionadas([])
        navigate(`/detalle/${detalleInmueble?.nro_bad}`)
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
      confirmButtonColor: "#1976d2",
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
    navigate(`/detalle/${detalleInmueble?.nro_bad}`)
  }

  const sumarMontosSeleccionados = () => {
    const total = reLiquidacionesSeleccionadas.reduce((accumulator, liquidacion) => {
      return accumulator + liquidacion.monto_original
    }, 0)

    return total
  }

  return (
    <div className="mt-16 ml-5 mr-5 mb-16">
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Cancelación especial de periodos de Cuenta Corriente
          </Typography>

          <Grid container spacing={3}>
            {/* Primera tabla */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" gutterBottom>
                Periodos disponibles
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={handleSeleccionarTodo}
                          checked={reLiquidacionesSeleccionadas.length === reLiquidaciones.length}
                        />
                      </TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell align="right">Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reLiquidaciones.map((liquidacion, index) => (
                      <TableRow key={index}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={reLiquidacionesSeleccionadas.includes(liquidacion)}
                            onChange={() => handleSeleccionar(liquidacion)}
                          />
                        </TableCell>
                        <TableCell>{liquidacion.periodo}</TableCell>
                        <TableCell align="right">
                          {formatNumberToARS(liquidacion.monto_original)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Segunda tabla */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" gutterBottom>
                Periodos a Cancelar
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>Periodo</TableCell>
                      <TableCell align="right">Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reLiquidacionesSeleccionadas.map((liquidacion, index) => (
                      <TableRow key={index}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={true}
                            onChange={() => handleSeleccionar(liquidacion)}
                          />
                        </TableCell>
                        <TableCell>{liquidacion.periodo}</TableCell>
                        <TableCell align="right">
                          {formatNumberToARS(liquidacion.monto_original)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" color="primary">Total:</Typography>
                <Typography variant="subtitle1" color="primary">
                  {formatNumberToARS(sumarMontosSeleccionados())}
                </Typography>
              </Box>
            </Grid>

            {/* Controles */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Motivo</InputLabel>
                <Select
                  value={motivo}
                  onChange={(e) => setMotivo(Number(e.target.value))}
                  label="Motivo"
                >
                  <MenuItem value={0}>Seleccione un tipo de transacción</MenuItem>
                  <MenuItem value={7}>Cancelación Operativa</MenuItem>
                  <MenuItem value={8}>Decreto/Resolución</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleAuditoria}
                  disabled={motivo === 0}
                  sx={{ mr: 2 }}
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
    </div>
  )
}

export default CancelarCtaCte
