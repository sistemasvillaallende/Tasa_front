import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import axios from 'axios';
import { useTasaContext } from '../../../context/TasaProvider';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

interface Deuda {
  periodo: string;
  fecha_transaccion: string;
  monto_original: number;
  debe: number;
  recargo: number;
  vencimiento: string;
  deuda_activa: boolean;
  des_categoria: string;
  nro_transaccion: number;
}

interface CategoriaDeuda {
  cod_categoria: number;
  des_categoria: string;
  id_subRubro: number;
  tipo_deuda: number;
}

const Deudas = () => {
  const { selectedInmueble, searchForm, setSearch } = useTasaContext();
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaDeuda[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<number>(0);
  const [montoOriginal, setMontoOriginal] = useState<number>(0);
  const [periodo, setPeriodo] = useState<string>('');
  const [vencimiento, setVencimiento] = useState<string>('');
  const [editingDeuda, setEditingDeuda] = useState<Deuda | null>(null);
  const [orderBy, setOrderBy] = useState<keyof Deuda>('nro_transaccion');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

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

  // Obtener los valores del searchForm.denominacion
  const cir = searchForm?.denominacion?.cir;
  const sec = searchForm?.denominacion?.sec;
  const man = searchForm?.denominacion?.man;
  const par = searchForm?.denominacion?.par;
  const p_h = searchForm?.denominacion?.p_h;

  const fetchDeudas = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_CTACTE}ListarDeudasXTasa?cir=${cir}&sec=${sec}&man=${man}&par=${par}&p_h=${p_h}`
      );
      setDeudas(response.data);
    } catch (error) {
      console.error('Error al obtener deudas:', error);
    }
  };

  useEffect(() => {
    if (cir && sec && man && par) {
      fetchDeudas();
    }
  }, [cir, sec, man, par, p_h]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_CTACTE}ListarCategoriaDeuda`);
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateDeuda = async () => {
    const categoriaSeleccionada = categorias.find(cat => cat.cod_categoria === selectedCategoria);

    const nuevaDeuda = {
      cir, sec, man, par, p_h,
      lstCtastes: [{
        tipo_transaccion: 1,
        circunscripcion: cir,
        seccion: sec,
        manzana: man,
        parcela: par,
        p_h: p_h,
        fecha_transaccion: new Date().toISOString(),
        periodo: periodo,
        cedulon_impreso: true,
        nro_pago_parcial: 0,
        monto_original: montoOriginal,
        pagado: false,
        debe: montoOriginal,
        haber: 0,
        deuda_activa: true,
        pago_parcial: false,
        categoria_deuda: selectedCategoria,
        vencimiento: vencimiento,
        nro_cedulon: 0,
        monto_pagado: 0,
        recargo: 0,
        honorarios: 0,
        iva_hons: 0,
        tipo_deuda: 0,
        decreto: "",
        observaciones: "",
        nro_cedulon_paypertic: 0,
        des_movimiento: "",
        des_categoria: categoriaSeleccionada?.des_categoria || "",
        deuda: 0,
        sel: 0,
        costo_financiero: 0,
        des_rubro: "",
        cod_tipo_per: 0,
        sub_total: 0
      }],
      auditoria: {
        id_auditoria: 0,
        fecha: new Date().toISOString(),
        usuario: "sistema",
        proceso: "nueva_deuda",
        identificacion: "",
        autorizaciones: "",
        observaciones: "",
        detalle: "",
        ip: ""
      }
    };

    try {
      await axios.post(`${import.meta.env.VITE_URL_CTACTE}NuevaDeuda`, nuevaDeuda);
      setOpenModal(false);
      await fetchDeudas();
      setPeriodo('');
      setVencimiento('');
      setMontoOriginal(0);
      setSelectedCategoria(0);

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'La deuda ha sido creada correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la deuda',
      });
      console.error('Error al crear deuda:', error);
    }
  };

  const handleEditDeuda = async (deuda: Deuda) => {
    const categoriaSeleccionada = categorias.find(cat => cat.cod_categoria === selectedCategoria);

    const deudaModificada = {
      cir, sec, man, par, p_h,
      lstCtastes: [{
        tipo_transaccion: 1,
        nro_transaccion: deuda.nro_transaccion,
        circunscripcion: cir,
        seccion: sec,
        manzana: man,
        parcela: par,
        p_h: p_h,
        fecha_transaccion: deuda.fecha_transaccion,
        periodo: periodo || deuda.periodo,
        cedulon_impreso: true,
        nro_pago_parcial: 0,
        monto_original: montoOriginal || deuda.monto_original,
        pagado: false,
        debe: montoOriginal || deuda.debe,
        haber: 0,
        deuda_activa: true,
        pago_parcial: false,
        categoria_deuda: selectedCategoria || deuda.categoria_deuda,
        vencimiento: vencimiento || deuda.vencimiento,
        nro_cedulon: 0,
        monto_pagado: 0,
        recargo: deuda.recargo,
        honorarios: 0,
        iva_hons: 0,
        tipo_deuda: 0,
        decreto: "",
        observaciones: "",
        nro_cedulon_paypertic: 0,
        des_movimiento: "",
        des_categoria: categoriaSeleccionada?.des_categoria || deuda.des_categoria,
        deuda: 0,
        sel: 0,
        costo_financiero: 0,
        des_rubro: "",
        cod_tipo_per: 0,
        sub_total: 0
      }],
      auditoria: {
        id_auditoria: 0,
        fecha: new Date().toISOString(),
        usuario: "sistema",
        proceso: "modificar_deuda",
        identificacion: "",
        autorizaciones: "",
        observaciones: "",
        detalle: "",
        ip: ""
      }
    };

    try {
      await axios.put(`${import.meta.env.VITE_URL_CTACTE}ModificarDeuda`, deudaModificada);
      setOpenModal(false);
      setEditingDeuda(null);
      await fetchDeudas();
      // Limpiar campos
      setPeriodo('');
      setVencimiento('');
      setMontoOriginal(0);
      setSelectedCategoria(0);

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'La deuda ha sido modificada correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo modificar la deuda',
      });
      console.error('Error al modificar deuda:', error);
    }
  };

  const handleDeleteDeuda = async (deuda: Deuda) => {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_URL_CTACTE}EliminarDeuda?cir=${cir}&sec=${sec}&man=${man}&par=${par}&p_h=${p_h}&nro_transaccion=${deuda.nro_transaccion}`,
          {
            data: {
              id_auditoria: 0,
              fecha: new Date().toISOString(),
              usuario: "sistema",
              proceso: "eliminar_deuda",
              identificacion: "",
              autorizaciones: "",
              observaciones: "",
              detalle: "",
              ip: ""
            }
          }
        );
        await fetchDeudas();

        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'La deuda ha sido eliminada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la deuda',
        });
        console.error('Error al eliminar deuda:', error);
      }
    }
  };

  const handleRequestSort = (property: keyof Deuda) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data: Deuda[]) => {
    return [...data].sort((a, b) => {
      if (orderBy === 'periodo') {
        return order === 'asc'
          ? a.periodo.localeCompare(b.periodo)
          : b.periodo.localeCompare(a.periodo);
      }
      if (orderBy === 'fecha_transaccion') {
        return order === 'asc'
          ? new Date(a.fecha_transaccion).getTime() - new Date(b.fecha_transaccion).getTime()
          : new Date(b.fecha_transaccion).getTime() - new Date(a.fecha_transaccion).getTime();
      }
      // Para nro_transaccion
      return order === 'asc'
        ? a.nro_transaccion - b.nro_transaccion
        : b.nro_transaccion - a.nro_transaccion;
    });
  };

  return (
    <div className="mt-16 ml-5 mr-5 mb-16">
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        Nueva Deuda
      </Button>

      <Dialog open={openModal} onClose={() => {
        setOpenModal(false);
        setEditingDeuda(null);
      }}>
        <DialogTitle>
          {editingDeuda ? 'Modificar Deuda' : 'Crear Nueva Deuda'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Periodo (AAAA/MM)"
            value={periodo}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 7) {
                const formattedValue = value
                  .replace(/\D/g, '')
                  .replace(/(\d{4})(\d{0,2})/, '$1/$2');
                setPeriodo(formattedValue);
              }
            }}
            placeholder="2024/12"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Fecha de Vencimiento"
            value={vencimiento}
            onChange={(e) => setVencimiento(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
          <Select
            fullWidth
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(Number(e.target.value))}
            sx={{ mt: 2 }}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat.cod_categoria} value={cat.cod_categoria}>
                {cat.des_categoria}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            type="number"
            label="Monto Original"
            value={montoOriginal}
            onChange={(e) => setMontoOriginal(Number(e.target.value))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenModal(false);
            setEditingDeuda(null);
          }}>
            Cancelar
          </Button>
          <Button
            onClick={() => editingDeuda ? handleEditDeuda(editingDeuda) : handleCreateDeuda()}
            variant="contained"
          >
            {editingDeuda ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="tabla de deudas">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'nro_transaccion'}
                    direction={orderBy === 'nro_transaccion' ? order : 'asc'}
                    onClick={() => handleRequestSort('nro_transaccion')}
                  >
                    N° Trans.
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'periodo'}
                    direction={orderBy === 'periodo' ? order : 'asc'}
                    onClick={() => handleRequestSort('periodo')}
                  >
                    Período
                  </TableSortLabel>
                </TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'fecha_transaccion'}
                    direction={orderBy === 'fecha_transaccion' ? order : 'asc'}
                    onClick={() => handleRequestSort('fecha_transaccion')}
                  >
                    Fecha Transacción
                  </TableSortLabel>
                </TableCell>
                <TableCell>Monto Original</TableCell>
                <TableCell>Debe</TableCell>
                <TableCell>Recargo</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortData(deudas)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((deuda, index) => (
                  <TableRow key={index}>
                    <TableCell>{deuda.nro_transaccion}</TableCell>
                    <TableCell>{deuda.periodo}</TableCell>
                    <TableCell>{deuda.des_categoria}</TableCell>
                    <TableCell>{new Date(deuda.fecha_transaccion).toLocaleDateString()}</TableCell>
                    <TableCell>${deuda.monto_original.toFixed(2)}</TableCell>
                    <TableCell>${deuda.debe.toFixed(2)}</TableCell>
                    <TableCell>${deuda.recargo.toFixed(2)}</TableCell>
                    <TableCell>{new Date(deuda.vencimiento).toLocaleDateString()}</TableCell>
                    <TableCell>{deuda.deuda_activa ? 'Activa' : 'Inactiva'}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => {
                          setEditingDeuda(deuda);
                          setSelectedCategoria(deuda.categoria_deuda);
                          setMontoOriginal(deuda.monto_original);
                          setPeriodo(deuda.periodo);
                          setVencimiento(deuda.vencimiento);
                          setOpenModal(true);
                        }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteDeuda(deuda)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={deudas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
    </div>
  );
};

export default Deudas;