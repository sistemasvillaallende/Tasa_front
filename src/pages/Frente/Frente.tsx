import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTasaContext } from '../../context/TasaProvider'
import axios from 'axios'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Grid,
  IconButton
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { getUserFromCookie } from '../../utils/cookies'
import Swal from 'sweetalert2'

interface Frente {
  circunscripcion: number
  seccion: number
  manzana: number
  parcela: number
  p_h: number
  nro_frente: number
  cod_calle: number
  nro_domicilio: number
  metros_frente: number
  cod_zona: number
}

interface Zona {
  cod_zona: number
  nom_zona: string
  tasa_basica_edificado: number
  excedente_edificado: number
  tasa_basica_baldio: number
  excedente_baldio: number
}

interface Calle {
  value: string
  text: string
  campo_enlace: string
}

const Frente = () => {
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams()
  const navigate = useNavigate()
  const { setInmuebles } = useTasaContext()
  const [frentes, setFrentes] = useState<Frente[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [zonas, setZonas] = useState<Zona[]>([])
  const [calles, setCalles] = useState<Calle[]>([])
  const [searchCalle, setSearchCalle] = useState('')
  const [nuevoFrente, setNuevoFrente] = useState({
    cod_calle: '',
    nro_domicilio: '',
    metros_frente: '',
    cod_zona: ''
  })
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [frenteEditar, setFrenteEditar] = useState<Frente | null>(null)
  const [detalleInmueble, setDetalleInmueble] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading) return

      try {
        let inmuebleData

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
          setDetalleInmueble(inmuebleData)
        } else if (id) {
          const inmuebleResponse = await axios.get(
            `${import.meta.env.VITE_URL_BASE}Inmuebles/GetInmuebleByNroBad?nro_bad=${id}`
          )
          inmuebleData = inmuebleResponse.data
          if (inmuebleData) {
            setDetalleInmueble(inmuebleData)
          }
        }

        if (!inmuebleData) {
          Swal.fire({
            title: "Error",
            text: "No se encontró el inmueble",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#27a3cf",
            position: 'top',
            customClass: {
              container: 'position-absolute'
            }
          })
          navigate('/')
          return
        }

        await fetchFrentes(inmuebleData)
        await fetchZonas()

      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
          position: 'top',
          customClass: {
            container: 'position-absolute'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [circunscripcion, seccion, manzana, parcela, p_h, id])

  const fetchFrentes = async (inmueble: any) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/FrentesXInmueble`, {
        params: {
          cir: inmueble.circunscripcion,
          sec: inmueble.seccion,
          man: inmueble.manzana,
          par: inmueble.parcela,
          p_h: inmueble.p_h
        }
      }
      )
      setFrentes(response.data)
    } catch (error) {
      console.error('Error al obtener frentes:', error)
    }
  }

  const fetchZonas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Inmuebles/GetZonas`)
      setZonas(response.data)
    } catch (error) {
      console.error('Error al obtener zonas:', error)
    }
  }

  const fetchCalles = async (search: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Inmuebles/GetCalle?nom_calle=${search}`)
      setCalles(response.data)
    } catch (error) {
      console.error('Error al obtener calles:', error)
    }
  }

  const handleSubmit = async () => {
    if (!detalleInmueble) return;

    try {
      const body = {
        frente: {
          circunscripcion: detalleInmueble.circunscripcion,
          seccion: detalleInmueble.seccion,
          manzana: detalleInmueble.manzana,
          parcela: detalleInmueble.parcela,
          p_h: detalleInmueble.p_h,
          cod_calle: Number(nuevoFrente.cod_calle),
          nro_domicilio: Number(nuevoFrente.nro_domicilio),
          metros_frente: Number(nuevoFrente.metros_frente),
          cod_zona: Number(nuevoFrente.cod_zona)
        },
        auditoria: {
          id_auditoria: 0,
          fecha: new Date().toISOString(),
          usuario: getUserFromCookie(),
          proceso: "Alta Frente",
          identificacion: "",
          autorizaciones: "",
          observaciones: "",
          detalle: "",
          ip: ""
        }
      };

      await axios.post(`${import.meta.env.VITE_URL_BASE}Inmuebles/NuevoFrente`, body);

      // Cerrar el diálogo
      setOpenDialog(false);

      // Limpiar el formulario
      setNuevoFrente({
        cod_calle: '',
        nro_domicilio: '',
        metros_frente: '',
        cod_zona: ''
      });

      // Actualizar la tabla
      await fetchFrentes(detalleInmueble);

      // Mostrar mensaje de éxito
      Swal.fire({
        title: "Éxito",
        text: "Frente agregado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
        position: 'top',
        customClass: {
          container: 'position-absolute'
        }
      });

    } catch (error) {
      console.error('Error al crear nuevo frente:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el frente",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
        position: 'top',
        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!frenteEditar || !detalleInmueble) return

    try {
      const body = {
        frente: {
          ...frenteEditar,
          cod_calle: Number(frenteEditar.cod_calle),
          nro_domicilio: Number(frenteEditar.nro_domicilio),
          metros_frente: Number(frenteEditar.metros_frente),
          cod_zona: Number(frenteEditar.cod_zona)
        },
        auditoria: {
          id_auditoria: 0,
          fecha: new Date().toISOString(),
          usuario: getUserFromCookie(),
          proceso: "Modificar Frente",
          identificacion: "",
          autorizaciones: "",
          observaciones: "",
          detalle: "",
          ip: ""
        }
      }

      await axios.put(`${import.meta.env.VITE_URL_BASE}Inmuebles/ModificarFrente`, body)
      setOpenEditDialog(false)
      setFrenteEditar(null)
      fetchFrentes()
    } catch (error) {
      console.error('Error al modificar frente:', error)
    }
  }

  // Configuración común para todos los Swal
  const swalConfig = {
    position: 'top',
    customClass: {
      container: 'position-absolute'
    }
  }

  const handleDelete = async (frente: Frente) => {
    try {
      const result = await Swal.fire({
        ...swalConfig,
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        const body = {
          id_auditoria: 0,
          fecha: new Date().toISOString(),
          usuario: getUserFromCookie(),
          proceso: "Eliminar Frente",
          identificacion: "",
          autorizaciones: "",
          observaciones: "",
          detalle: "",
          ip: ""
        }

        await axios.delete(
          `${import.meta.env.VITE_URL_BASE}Inmuebles/EliminarFrente?cir=${frente.circunscripcion}&sec=${frente.seccion}&man=${frente.manzana}&par=${frente.parcela}&p_h=${frente.p_h}&nro_frente=${frente.nro_frente}`,
          { data: body }
        )

        await fetchFrentes()
        Swal.fire({
          ...swalConfig,
          title: 'Eliminado',
          text: 'El frente ha sido eliminado.',
          icon: 'success'
        })
      }
    } catch (error) {
      console.error('Error al eliminar frente:', error)
      Swal.fire({
        ...swalConfig,
        title: 'Error',
        text: 'No se pudo eliminar el frente',
        icon: 'error'
      })
    }
  }

  // Configuración común para los Dialogs
  const dialogProps = {
    maxWidth: "sm" as const,
    fullWidth: true,
    PaperProps: {
      style: {
        position: 'fixed',
        top: 20,
        margin: 0
      }
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Frentes del Inmueble
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nuevo Frente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="tabla de frentes">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Nro. Frente</TableCell>
              <TableCell sx={{ color: 'white' }}>Cód. Calle</TableCell>
              <TableCell sx={{ color: 'white' }}>Nro. Domicilio</TableCell>
              <TableCell sx={{ color: 'white' }}>Metros Frente</TableCell>
              <TableCell sx={{ color: 'white' }}>Cód. Zona</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {frentes.map((frente) => (
              <TableRow key={frente.nro_frente}>
                <TableCell>{frente.nro_frente}</TableCell>
                <TableCell>{frente.cod_calle}</TableCell>
                <TableCell>{frente.nro_domicilio}</TableCell>
                <TableCell>{frente.metros_frente}</TableCell>
                <TableCell>{frente.cod_zona}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setFrenteEditar(frente)
                      setOpenEditDialog(true)
                    }}
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(frente)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {frentes.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          No se encontraron frentes para este inmueble
        </Typography>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            position: 'fixed',
            top: 20,
            margin: 0
          }
        }}
      >
        <DialogTitle>Nuevo Frente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={calles}
                getOptionLabel={(option) => option.text}
                onInputChange={(_, newValue) => {
                  setSearchCalle(newValue)
                  fetchCalles(newValue)
                }}
                onChange={(_, newValue) => {
                  setNuevoFrente({
                    ...nuevoFrente,
                    cod_calle: newValue?.value || ''
                  })
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Calle" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Número de Domicilio"
                fullWidth
                value={nuevoFrente.nro_domicilio}
                onChange={(e) => setNuevoFrente({
                  ...nuevoFrente,
                  nro_domicilio: e.target.value
                })}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Metros de Frente"
                fullWidth
                value={nuevoFrente.metros_frente}
                onChange={(e) => setNuevoFrente({
                  ...nuevoFrente,
                  metros_frente: e.target.value
                })}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={zonas}
                getOptionLabel={(option) => `${option.cod_zona} - ${option.nom_zona}`}
                onChange={(_, newValue) => {
                  setNuevoFrente({
                    ...nuevoFrente,
                    cod_zona: newValue?.cod_zona.toString() || ''
                  })
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Zona" fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            position: 'fixed',
            top: 20,
            margin: 0
          }
        }}
      >
        <DialogTitle>Editar Frente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={calles}
                getOptionLabel={(option) => option.text}
                value={calles.find(c => c.value === frenteEditar?.cod_calle.toString()) || null}
                onInputChange={(_, newValue) => {
                  setSearchCalle(newValue)
                  fetchCalles(newValue)
                }}
                onChange={(_, newValue) => {
                  setFrenteEditar(prev => prev ? {
                    ...prev,
                    cod_calle: Number(newValue?.value || 0)
                  } : null)
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Calle" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Número de Domicilio"
                fullWidth
                value={frenteEditar?.nro_domicilio || ''}
                onChange={(e) => setFrenteEditar(prev => prev ? {
                  ...prev,
                  nro_domicilio: Number(e.target.value)
                } : null)}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Metros de Frente"
                fullWidth
                value={frenteEditar?.metros_frente || ''}
                onChange={(e) => setFrenteEditar(prev => prev ? {
                  ...prev,
                  metros_frente: Number(e.target.value)
                } : null)}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={zonas}
                getOptionLabel={(option) => `${option.cod_zona} - ${option.nom_zona}`}
                value={zonas.find(z => z.cod_zona === frenteEditar?.cod_zona) || null}
                onChange={(_, newValue) => {
                  setFrenteEditar(prev => prev ? {
                    ...prev,
                    cod_zona: newValue?.cod_zona || 0
                  } : null)
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Zona" fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Frente