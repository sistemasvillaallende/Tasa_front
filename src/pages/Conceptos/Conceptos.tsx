import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTasaContext } from '../../context/TasaProvider'
import Table from '../../base-components/Table'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

interface Concepto {
  circunscripcion: number
  seccion: number
  manzana: number
  parcela: number
  p_h: number
  cod_concepto_inmueble: number
  des_concepto_inmueble: string
  porcentaje: number
  monto: number
  vencimiento: string
  nro_decreto: number
  fecha_alta_registro: string
  activo: number
  observaciones: string
  anio_desde: number
  anio_hasta: number
}

interface ConceptoSelect {
  codigo: number;
  descripcion: string;
  tipo: string;
}

interface ObjAuditoria {
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

const Conceptos = () => {
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams()
  const navigate = useNavigate()
  const { inmuebles, setInmuebles } = useTasaContext()
  const [conceptos, setConceptos] = useState<Concepto[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [conceptosSelect, setConceptosSelect] = useState<ConceptoSelect[]>([])
  const [selectedConcepto, setSelectedConcepto] = useState<ConceptoSelect | null>(null)
  const [detalleInmueble, setDetalleInmueble] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingConcepto, setEditingConcepto] = useState<Concepto | null>(null)
  const [newConcepto, setNewConcepto] = useState({
    cod_concepto_inmueble: 0,
    des_concepto_inmueble: '',
    porcentaje: 0,
    monto: 0,
    vencimiento: '',
    nro_decreto: 0,
    anio_desde: new Date().getFullYear(),
    anio_hasta: new Date().getFullYear(),
    activo: 1,
    observaciones: ''
  })

  useEffect(() => {
    const fetchData = async () => {
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
          );
          inmuebleData = response.data;
          setInmuebles([inmuebleData]);
          setDetalleInmueble(inmuebleData);
        } else if (id) {
          inmuebleData = inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id);
          if (inmuebleData) {
            setDetalleInmueble(inmuebleData);
          }
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
          });
          navigate('/');
          return;
        }

        await fetchConceptos(inmuebleData);
        await fetchConceptosSelect();

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [circunscripcion, seccion, manzana, parcela, p_h, id]);

  const fetchConceptos = async (inmueble: any) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Conceptos_inmueble/listConceptosXinmueble`, {
        params: {
          cir: inmueble.circunscripcion,
          sec: inmueble.seccion,
          man: inmueble.manzana,
          par: inmueble.parcela,
          p_h: inmueble.p_h
        }
      }
      );
      setConceptos(response.data);
    } catch (error) {
      console.error('Error al cargar conceptos:', error);
    }
  };

  const getUserFromCookie = () => {
    try {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('VABack.CIDI='))

      if (cookie) {
        const decodedValue = decodeURIComponent(cookie.split('=')[1])
        const match = decodedValue.match(/nombre_usuario=([^&\s]+)/)
        const nombreUsuario = match ? match[1].trim() : ''

        console.log('Cookie encontrada:', decodedValue)
        console.log('Usuario extraído:', nombreUsuario)

        return nombreUsuario || 'USUARIO'
      }
    } catch (error) {
      console.error('Error al procesar la cookie:', error)
    }

    return 'USUARIO'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown }
    if (name) {
      setNewConcepto(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAgregarConcepto = async () => {
    const usuario = getUserFromCookie();
    if (!usuario || !detalleInmueble) {
      Swal.fire({
        title: "Error",
        text: "Faltan datos necesarios para agregar el concepto",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
      return;
    }

    try {
      const now = new Date().toISOString();
      const conceptoData = {
        circunscripcion: detalleInmueble.circunscripcion,
        seccion: detalleInmueble.seccion,
        manzana: detalleInmueble.manzana,
        parcela: detalleInmueble.parcela,
        p_h: detalleInmueble.p_h,
        cod_concepto_inmueble: Number(newConcepto.cod_concepto_inmueble),
        des_concepto_inmueble: newConcepto.des_concepto_inmueble,
        porcentaje: Number(newConcepto.porcentaje),
        monto: Number(newConcepto.monto),
        vencimiento: newConcepto.vencimiento + "T00:00:00.000",
        nro_decreto: 0,
        fecha_alta_registro: now,
        activo: Number(newConcepto.activo),
        observaciones: "",
        anio_desde: Number(newConcepto.anio_desde),
        anio_hasta: Number(newConcepto.anio_hasta),
        objAuditoria: {
          id_auditoria: 0,
          fecha: now,
          usuario: usuario,
          proceso: "Alta Concepto",
          identificacion: "",
          autorizaciones: "",
          observaciones: "",
          detalle: "",
          ip: ""
        }
      };

      await axios.post(
        `${import.meta.env.VITE_URL_BASE}Conceptos_inmueble/AddConcepto?usuario=${usuario}`,
        conceptoData
      );

      Swal.fire({
        title: "Éxito",
        text: "Concepto agregado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });

      setIsModalOpen(false);
      await fetchConceptos(detalleInmueble);

    } catch (error) {
      console.error('Error al agregar concepto:', error);
      Swal.fire({
        title: "Error",
        text: "Error al agregar el concepto",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  const fetchConceptosSelect = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}Conceptos_inmueble/GetAllConceptos`)
      setConceptosSelect(response.data)
    } catch (error) {
      console.error('Error al cargar conceptos:', error)
    }
  }

  const handleConceptoChange = (event: any, value: ConceptoSelect | null) => {
    setSelectedConcepto(value)
    if (value) {
      setNewConcepto(prev => ({
        ...prev,
        cod_concepto_inmueble: value.codigo,
        des_concepto_inmueble: value.descripcion
      }))
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('es-AR')
    } catch (error) {
      return ''
    }
  }

  const handleEditClick = (concepto: Concepto) => {
    setEditingConcepto(concepto);
    setNewConcepto({
      cod_concepto_inmueble: concepto.cod_concepto_inmueble,
      des_concepto_inmueble: concepto.des_concepto_inmueble,
      porcentaje: concepto.porcentaje,
      monto: concepto.monto,
      vencimiento: concepto.vencimiento.split('T')[0],
      nro_decreto: concepto.nro_decreto,
      anio_desde: concepto.anio_desde,
      anio_hasta: concepto.anio_hasta,
      activo: concepto.activo,
      observaciones: concepto.observaciones
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConcepto(null);
    setNewConcepto({
      cod_concepto_inmueble: 0,
      des_concepto_inmueble: '',
      porcentaje: 0,
      monto: 0,
      vencimiento: '',
      nro_decreto: 0,
      anio_desde: new Date().getFullYear(),
      anio_hasta: new Date().getFullYear(),
      activo: 1,
      observaciones: ''
    });
  };

  const handleUpdateConcepto = async () => {
    const usuario = getUserFromCookie();
    if (!usuario || !detalleInmueble || !editingConcepto) {
      Swal.fire({
        title: "Error",
        text: "Faltan datos necesarios para la actualización",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
      return;
    }

    try {
      const now = new Date().toISOString();
      const conceptoData = {
        circunscripcion: detalleInmueble.circunscripcion,
        seccion: detalleInmueble.seccion,
        manzana: detalleInmueble.manzana,
        parcela: detalleInmueble.parcela,
        p_h: detalleInmueble.p_h,
        cod_concepto_inmueble: Number(newConcepto.cod_concepto_inmueble),
        des_concepto_inmueble: newConcepto.des_concepto_inmueble,
        porcentaje: Number(newConcepto.porcentaje),
        monto: Number(newConcepto.monto),
        vencimiento: newConcepto.vencimiento + "T00:00:00.000",
        nro_decreto: 0,
        fecha_alta_registro: editingConcepto.fecha_alta_registro || now,
        activo: Number(newConcepto.activo),
        observaciones: "",
        anio_desde: Number(newConcepto.anio_desde),
        anio_hasta: Number(newConcepto.anio_hasta),
        objAuditoria: {
          id_auditoria: 0,
          fecha: now,
          usuario: usuario,
          proceso: "Modificación Concepto",
          identificacion: "",
          autorizaciones: "",
          observaciones: "",
          detalle: "",
          ip: ""
        }
      };

      await axios.put(
        `${import.meta.env.VITE_URL_BASE}Conceptos_inmueble/UpdateConcepto?usuario=${usuario}`,
        conceptoData
      );

      Swal.fire({
        title: "Éxito",
        text: "Concepto actualizado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });

      setIsModalOpen(false);
      setEditingConcepto(null);
      await fetchConceptos(detalleInmueble);

    } catch (error) {
      console.error('Error al actualizar concepto:', error);
      Swal.fire({
        title: "Error",
        text: "Error al actualizar el concepto",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  const handleDeleteClick = async (concepto: Concepto) => {
    const usuario = getUserFromCookie();
    if (!usuario || !selectedInmueble) return;

    try {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: `¿Desea eliminar el concepto "${concepto.des_concepto_inmueble}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",

        customClass: {
          container: 'position-absolute'
        }
      });

      if (result.isConfirmed) {
        const now = new Date().toISOString();
        const conceptoData = {
          circunscripcion: selectedInmueble.circunscripcion,
          seccion: selectedInmueble.seccion,
          manzana: selectedInmueble.manzana,
          parcela: selectedInmueble.parcela,
          p_h: selectedInmueble.p_h,
          cod_concepto_inmueble: concepto.cod_concepto_inmueble,
          des_concepto_inmueble: concepto.des_concepto_inmueble,
          porcentaje: concepto.porcentaje,
          monto: concepto.monto,
          vencimiento: concepto.vencimiento,
          nro_decreto: concepto.nro_decreto,
          fecha_alta_registro: concepto.fecha_alta_registro,
          activo: concepto.activo,
          observaciones: concepto.observaciones,
          anio_desde: concepto.anio_desde,
          anio_hasta: concepto.anio_hasta,
          objAuditoria: {
            id_auditoria: 0,
            fecha: now,
            usuario: usuario,
            proceso: "Baja Concepto",
            identificacion: "",
            autorizaciones: "",
            observaciones: "",
            detalle: "",
            ip: ""
          }
        };

        await axios.delete(
          `${import.meta.env.VITE_URL_BASE}Conceptos_inmueble/DeleteConcepto?usuario=${usuario}`,
          { data: conceptoData }
        );

        Swal.fire({
          title: "Eliminado",
          text: "El concepto ha sido eliminado correctamente",
          icon: "success",
          confirmButtonColor: "#27a3cf",

          customClass: {
            container: 'position-absolute'
          }
        });

        await fetchConceptos();
      }
    } catch (error) {
      console.error('Error al eliminar concepto:', error);
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el concepto",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",

        customClass: {
          container: 'position-absolute'
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pt-5">
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-medium">Conceptos del Inmueble</h2>
          <Button
            variant="contained"
            onClick={() => {
              setEditingConcepto(null);
              setIsModalOpen(true);
            }}
          >
            Agregar Concepto
          </Button>
        </div>

        {conceptos.length > 0 ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Concepto</Table.Th>
                <Table.Th>Porcentaje</Table.Th>
                <Table.Th>Monto</Table.Th>
                <Table.Th>Vencimiento</Table.Th>
                <Table.Th>Fecha Alta</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Período</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {conceptos.map((concepto, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{concepto.des_concepto_inmueble}</Table.Td>
                  <Table.Td className="text-right">{concepto.porcentaje}%</Table.Td>
                  <Table.Td className="text-right">
                    ${concepto.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </Table.Td>
                  <Table.Td>{formatDate(concepto.vencimiento)}</Table.Td>
                  <Table.Td>{formatDate(concepto.fecha_alta_registro)}</Table.Td>
                  <Table.Td>
                    <span className={`px-2 py-1 rounded-full text-xs ${concepto.activo ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                      {concepto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </Table.Td>
                  <Table.Td>
                    {concepto.anio_desde === concepto.anio_hasta
                      ? concepto.anio_desde
                      : `${concepto.anio_desde} - ${concepto.anio_hasta}`}
                  </Table.Td>
                  <Table.Td>
                    <div className="flex gap-2">
                      <IconButton
                        onClick={() => handleEditClick(concepto)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(concepto)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <div className="text-center text-gray-500">No hay conceptos para mostrar</div>
        )}

        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              margin: 0
            }
          }}
        >
          <DialogTitle>
            {editingConcepto ? 'Editar Concepto' : 'Agregar Concepto'}
          </DialogTitle>
          <DialogContent>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Autocomplete
                options={conceptosSelect}
                getOptionLabel={(option) => `${option.descripcion} (${option.tipo})`}
                value={selectedConcepto}
                onChange={handleConceptoChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar Concepto"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <TextField
                type="number"
                label="Porcentaje"
                name="porcentaje"
                value={newConcepto.porcentaje}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                type="number"
                label="Monto"
                name="monto"
                value={newConcepto.monto}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                type="date"
                label="Vencimiento"
                name="vencimiento"
                value={newConcepto.vencimiento}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="number"
                label="Año Desde"
                name="anio_desde"
                value={newConcepto.anio_desde}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                type="number"
                label="Año Hasta"
                name="anio_hasta"
                value={newConcepto.anio_hasta}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="activo"
                  value={newConcepto.activo}
                  onChange={handleInputChange}
                  label="Estado"
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              onClick={editingConcepto ? handleUpdateConcepto : handleAgregarConcepto}
              variant="contained"
              color="primary"
            >
              {editingConcepto ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default Conceptos