import React, { useEffect, useState } from 'react';
import { useTasaContext } from '../../../context/TasaProvider';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Autocomplete
} from '@mui/material';
import {
  Home as HomeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationCity as LocationIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';

// Función para formatear la fecha
const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return dateString;
  }
};

interface DomicilioPostalData {
  nom_calle_dom_esp: string;
  cod_calle_dom_esp: number;
  piso_dpto_esp: string;
  cod_barrio_dom_esp: number;
  nom_barrio_dom_esp: string;
  ciudad_dom_esp: string;
  provincia_dom_esp: string;
  pais_dom_esp: string;
  cod_postal: string;
  email_envio_cedulon: string;
  telefono: string;
  celular: string;
  cuit_ocupante: string;
  fecha_cambio_domicilio: string;
  nro_bad: number;
  nro_dom_esp: number;
}

interface Auditoria {
  id_auditoria: number;
  fecha: string;
  usuario: string;
  proceso: string;
  identificacion: string;
  autorizaciones: string;
  observaciones: string;
  detalle: string;
  ip: string;
}

interface Calle {
  value: string;
  text: string;
  campo_enlace: string;
}

interface Barrio {
  cod_barrio: number;
  nom_barrio: string;
  barrioCerrado: number;
}

const DomicilioPostal = () => {
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams();
  const { inmuebles, setInmuebles } = useTasaContext();
  const [detalleInmueble, setDetalleInmueble] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [domicilioData, setDomicilioData] = useState<DomicilioPostalData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<DomicilioPostalData | null>(null);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [searchCalle, setSearchCalle] = useState('');
  const navigate = useNavigate();

  const handleCalleSearch = async (searchTerm: string) => {
    if (searchTerm.length < 3) return;

    try {
      const response = await axios.get<Calle[]>(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/GetCalle`, {
        params: { nom_calle: searchTerm }
      }
      );
      setCalles(response.data);
    } catch (error) {
      console.error('Error al buscar calles:', error);
      Swal.fire({
        title: "Error",
        text: "Error al buscar calles",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  const handleBarrioSearch = async (searchTerm: string) => {
    if (searchTerm.length < 1) return;

    try {
      const response = await axios.get<Barrio[]>(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/GetBarrios`, {
        params: { barrio: searchTerm }
      }
      );
      setBarrios(response.data);
    } catch (error) {
      console.error('Error al buscar barrios:', error);
      Swal.fire({
        title: "Error",
        text: "Error al buscar barrios",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  const handleEditClick = () => {
    setEditData(domicilioData);
    setOpenDialog(true);
  };

  const fetchDomicilioPostal = async (params: { cir: string, sec: string, man: string, par: string, p_h: string }) => {
    try {
      const response = await axios.get<DomicilioPostalData>(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/DatosDomicilioPostal`, {
        params: params
      }
      );
      setDomicilioData(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del domicilio:', error);
      Swal.fire({
        title: "Error",
        text: "Error al obtener datos del domicilio",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isLoading) return;

      try {
        if (circunscripcion && seccion && manzana && parcela && p_h) {
          await fetchDomicilioPostal({
            cir: circunscripcion,
            sec: seccion,
            man: manzana,
            par: parcela,
            p_h: p_h
          });
        } else if (id) {
          const inmueble = inmuebles?.find((i) => i.nro_bad.toString() === id);
          if (inmueble) {
            await fetchDomicilioPostal({
              cir: inmueble.circunscripcion.toString(),
              sec: inmueble.seccion.toString(),
              man: inmueble.manzana.toString(),
              par: inmueble.parcela.toString(),
              p_h: inmueble.p_h.toString()
            });
          } else {
            throw new Error("No se encontró el inmueble");
          }
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",

          customClass: {
            container: 'position-absolute'
          }
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [circunscripcion, seccion, manzana, parcela, p_h, id]);

  const handleUpdate = async () => {
    if (!editData) {
      console.error('No hay datos para actualizar');
      return;
    }

    if (!circunscripcion || !seccion || !manzana || !parcela || !p_h) {
      console.error('Faltan parámetros de nomenclatura');
      return;
    }

    try {
      console.log('Enviando actualización...', {
        params: { circunscripcion, seccion, manzana, parcela, p_h },
        data: editData
      });

      const response = await axios.put(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/ActualizarDomicilioPostal`, {
        datosDomicilio: {
          ...editData,
          fecha_cambio_domicilio: new Date().toISOString()
        },
        auditoria: {
          id_auditoria: 0,
          fecha: new Date().toISOString(),
          usuario: "sistema",
          proceso: "actualizar_domicilio",
          identificacion: "",
          autorizaciones: "",
          observaciones: "",
          detalle: "",
          ip: ""
        }
      }, {
        params: {
          cir: circunscripcion,
          sec: seccion,
          man: manzana,
          par: parcela,
          p_h: p_h
        }
      }
      );

      console.log('Respuesta:', response);

      if (response.status === 200) {
        setDomicilioData(editData);
        setOpenDialog(false);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Domicilio actualizado correctamente',
          timer: 2000,
          showConfirmButton: false,

          customClass: {
            container: 'position-absolute'
          }
        });
      }
    } catch (error) {
      console.error('Error al actualizar domicilio:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el domicilio',

        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  return (
    <div className="mt-16 ml-5 mr-5 mb-16">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Editar Domicilio
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Dirección */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <HomeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Dirección</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography>
                  <strong>Calle:</strong> {domicilioData?.nom_calle_dom_esp}
                </Typography>
                <Typography>
                  <strong>Número:</strong> {domicilioData?.nro_dom_esp}
                </Typography>
                <Typography><strong>Barrio:</strong> {domicilioData?.nom_barrio_dom_esp}</Typography>
                <Typography><strong>Ciudad:</strong> {domicilioData?.ciudad_dom_esp}</Typography>
                <Typography><strong>Provincia:</strong> {domicilioData?.provincia_dom_esp}</Typography>
                <Typography><strong>País:</strong> {domicilioData?.pais_dom_esp}</Typography>
                <Typography><strong>Código Postal:</strong> {domicilioData?.cod_postal}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Contacto */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Información de Contacto</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography><strong>Teléfono:</strong> {domicilioData?.telefono || 'No especificado'}</Typography>
                <Typography><strong>Celular:</strong> {domicilioData?.celular || 'No especificado'}</Typography>
                <Typography><strong>Email:</strong> {domicilioData?.email_envio_cedulon || 'No especificado'}</Typography>
                <Typography><strong>CUIT Ocupante:</strong> {domicilioData?.cuit_ocupante || 'No especificado'}</Typography>
                <Typography>
                  <strong>Última actualización:</strong> {formatDate(domicilioData?.fecha_cambio_domicilio || '')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              position: 'fixed',
              top: 50,
              margin: 0
            }
          }}
        >
          <DialogTitle>Editar Domicilio Postal</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={calles}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                      return option;
                    }
                    return option.text || '';
                  }}
                  value={editData?.nom_calle_dom_esp || ''}
                  inputValue={searchCalle}
                  onInputChange={(event, newInputValue) => {
                    setSearchCalle(newInputValue);
                    handleCalleSearch(newInputValue);
                  }}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setEditData(prev => prev ? {
                        ...prev,
                        nom_calle_dom_esp: newValue,
                        cod_calle_dom_esp: 0
                      } : null);
                    } else if (newValue && 'text' in newValue) {
                      setEditData(prev => prev ? {
                        ...prev,
                        nom_calle_dom_esp: newValue.text,
                        cod_calle_dom_esp: parseInt(newValue.value)
                      } : null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Calle"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => {
                    if (typeof value === 'string') {
                      return option.text === value;
                    }
                    return option.text === value.text;
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número"
                  value={editData?.nro_dom_esp || ''}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, nro_dom_esp: Number(e.target.value) } : null)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={barrios}
                  getOptionLabel={(option) => option.nom_barrio}
                  value={barrios.find(barrio => barrio.cod_barrio === editData?.cod_barrio_dom_esp) || null}
                  onChange={(event, newValue) => {
                    setEditData(prev => {
                      if (!prev) return null;

                      if (!newValue) {
                        return {
                          ...prev,
                          nom_barrio_dom_esp: '',
                          cod_barrio_dom_esp: 0
                        };
                      }

                      return {
                        ...prev,
                        nom_barrio_dom_esp: newValue.nom_barrio,
                        cod_barrio_dom_esp: newValue.cod_barrio
                      };
                    });
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input') {
                      handleBarrioSearch(newInputValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Barrio"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => {
                    if (!value) return false;
                    return option.cod_barrio === value.cod_barrio;
                  }}
                  noOptionsText="No se encontraron barrios"
                  loadingText="Buscando..."
                  clearOnBlur={false}
                  clearOnEscape={true}
                  blurOnSelect={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={editData?.ciudad_dom_esp || ''}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, ciudad_dom_esp: e.target.value } : null)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editData?.email_envio_cedulon || ''}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, email_envio_cedulon: e.target.value } : null)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={editData?.telefono || ''}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, telefono: e.target.value } : null)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Celular"
                  value={editData?.celular || ''}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, celular: e.target.value } : null)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CUIT Ocupante"
                  value={editData?.cuit_ocupante || ''}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, cuit_ocupante: e.target.value } : null)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="primary"
              disabled={!editData}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default DomicilioPostal; 