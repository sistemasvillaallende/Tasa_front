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
} from '@mui/material'
import Swal from 'sweetalert2'

const CancelarCtaCte = () => {
  const [reLiquidaciones, setReLiquidaciones] = useState<any[]>([])
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<any[]>([])
  const [motivo, setMotivo] = useState<number>(0)
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams()
  const { inmuebles, setInmuebles } = useTasaContext()
  const [detalleInmueble, setDetalleInmueble] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInmueble = async () => {
      if (!isLoading) return;

      try {
        let inmuebleData;

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
          setInmuebles([inmuebleData])
        } else if (id) {
          inmuebleData = inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id)
        }

        if (!inmuebleData) {
          Swal.fire({
            title: "Error",
            text: "No se encontró el inmueble",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",

            customClass: {
              container: 'position-absolute'
            }
          })
          navigate('/')
          return
        }

        setDetalleInmueble(inmuebleData)

        // Fetch períodos a cancelar
        const apiUrl = `${import.meta.env.VITE_URL_CTACTE}Listar_periodos_a_cancelar`
        const response = await axios.get(apiUrl, {
          params: {
            cir: inmuebleData.circunscripcion,
            sec: inmuebleData.seccion,
            man: inmuebleData.manzana,
            par: inmuebleData.parcela,
            p_h: inmuebleData.p_h
          }
        })
        setReLiquidaciones(response.data)

      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",

          customClass: {
            container: 'position-absolute'
          }
        })
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInmueble()
  }, [circunscripcion, seccion, manzana, parcela, p_h, id])

  const handleCancelarCtaCte = async (auditoria: string) => {
    if (!detalleInmueble) return;

    try {
      const consulta = {
        cir: detalleInmueble.circunscripcion,
        sec: detalleInmueble.seccion,
        man: detalleInmueble.manzana,
        par: detalleInmueble.parcela,
        p_h: detalleInmueble.p_h,
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

      const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/Confirma_cancelacion_ctasctes?tipo_transaccion=${motivo}`
      await axios.post(apiUrl, consulta)

      Swal.fire({
        title: "Cancelación realizada",
        text: "Se ha cancelado correctamente los periodos seleccionados.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      })

      setReLiquidacionesSeleccionadas([])
      navigate(`/detalle/${detalleInmueble.circunscripcion}/${detalleInmueble.seccion}/${detalleInmueble.manzana}/${detalleInmueble.parcela}/${detalleInmueble.p_h}`)
    } catch (error: any) {
      Swal.fire({
        title: error.response?.status ? `${error.response.status}: ${error.response.statusText}` : "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      })
    }
  }

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

  const handleAuditoria = async () => {
    const { value } = await Swal.fire({
      title: "Autorización",
      input: "textarea",
      inputPlaceholder: "Observaciones",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1976d2",

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
