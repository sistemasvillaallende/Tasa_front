import React, { useEffect, useState } from 'react';
import { useTasaContext } from '../../../context/TasaProvider';
import axios from 'axios';
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
  const { selectedInmueble, searchForm, setSearch } = useTasaContext();
  const [domicilioData, setDomicilioData] = useState<DomicilioPostalData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<DomicilioPostalData | null>(null);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [searchCalle, setSearchCalle] = useState('');
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [searchBarrio, setSearchBarrio] = useState('');

  useEffect(() => {
    if (selectedInmueble) {
      const { circunscripcion, seccion, manzana, parcela, p_h } = selectedInmueble;
      setSearch({
        ...searchForm,
        denominacion: {
          cir: circunscripcion,
          sec: seccion,
          man: manzana,
          par: parcela,
          p_h: p_h || 0
        }
      });
    }
  }, [selectedInmueble]);

  const cir = searchForm?.denominacion?.cir;
  const sec = searchForm?.denominacion?.sec;
  const man = searchForm?.denominacion?.man;
  const par = searchForm?.denominacion?.par;
  const p_h = searchForm?.denominacion?.p_h;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchDomicilioPostal = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Inmuebles/DatosDomicilioPostal?cir=${cir}&sec=${sec}&man=${man}&par=${par}&p_h=${p_h}`
        );
        setDomicilioData(response.data);
      } catch (error) {
        console.error('Error al obtener datos del domicilio:', error);
      }
    };

    if (cir && sec && man && par) {
      fetchDomicilioPostal();
    }
  }, [cir, sec, man, par, p_h]);

  const handleEdit = () => {
    setEditData(domicilioData);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      const auditoria: Auditoria = {
        id_auditoria: 0,
        fecha: new Date().toISOString(),
        usuario: "sistema",
        proceso: "actualizar_domicilio",
        identificacion: "",
        autorizaciones: "",
        observaciones: "",
        detalle: "",
        ip: ""
      };

      const response = await axios.put(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/ActualizarDomicilioPostal?cir=${cir}&sec=${sec}&man=${man}&par=${par}&p_h=${p_h}`,
        {
          datosDomicilio: editData,
          auditoria
        }
      );

      if (response.status === 200) {
        setDomicilioData(editData);
        setOpenDialog(false);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Domicilio actualizado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error al actualizar domicilio:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el domicilio'
      });
    }
  };

  const fetchCalles = async (search: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/GetCalle?nom_calle=${search}`
      );
      setCalles(response.data);
    } catch (error) {
      console.error('Error al obtener calles:', error);
    }
  };

  const handleCalleSearch = (value: string) => {
    setSearchCalle(value);
    if (value.length > 0) {
      fetchCalles(value);
    }
  };

  const fetchBarrios = async (search: string) => {
    try {
      console.log('Buscando barrio:', search);
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/GetBarrios?barrio=${search}`
      );
      console.log('Barrios encontrados:', response.data);
      setBarrios(response.data);
    } catch (error) {
      console.error('Error al obtener barrios:', error);
    }
  };

  const handleBarrioSearch = (value: string) => {
    setSearchBarrio(value);
    if (value.length > 0) {
      fetchBarrios(value);
    }
  };

  if (!domicilioData) {
    return <Typography>Cargando datos del domicilio...</Typography>;
  }

  return (
    <div className="mt-16 ml-5 mr-5 mb-16">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
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
                  <strong>Calle:</strong> {domicilioData.nom_calle_dom_esp}
                </Typography>
                <Typography>
                  <strong>Número:</strong> {domicilioData.nro_dom_esp}
                </Typography>
                <Typography><strong>Barrio:</strong> {domicilioData.nom_barrio_dom_esp}</Typography>
                <Typography><strong>Ciudad:</strong> {domicilioData.ciudad_dom_esp}</Typography>
                <Typography><strong>Provincia:</strong> {domicilioData.provincia_dom_esp}</Typography>
                <Typography><strong>País:</strong> {domicilioData.pais_dom_esp}</Typography>
                <Typography><strong>Código Postal:</strong> {domicilioData.cod_postal}</Typography>
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
                <Typography><strong>Teléfono:</strong> {domicilioData.telefono || 'No especificado'}</Typography>
                <Typography><strong>Celular:</strong> {domicilioData.celular || 'No especificado'}</Typography>
                <Typography><strong>Email:</strong> {domicilioData.email_envio_cedulon || 'No especificado'}</Typography>
                <Typography><strong>CUIT Ocupante:</strong> {domicilioData.cuit_ocupante || 'No especificado'}</Typography>
                <Typography>
                  <strong>Última actualización:</strong> {formatDate(domicilioData.fecha_cambio_domicilio)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
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
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default DomicilioPostal; 