import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Autocomplete,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Button
} from '@mui/material';
import html2pdf from 'html2pdf.js';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import './PorConceptos.css';
import logoNotas from '../../assets/logo-notas.png';

interface Concepto {
  codigo: number;
  descripcion: string;
  tipo: string;
}

interface InmuebleConcepto {
  cod_concepto_inmueble: number;
  des_concepto_inmueble: string;
  circunscripcion: number;
  seccion: number;
  manzana: number;
  parcela: number;
  p_h: number;
  porcentaje: number;
  monto: number;
  nom_calle: string;
  nro_dom_pf: number;
  nro_bad: number;
  nombre: string;
  activo: boolean;
  fecha_alta_registro: string | null;
  anio_desde: number;
  anio_hasta: number;
}

const PorConceptos = () => {
  const [conceptos, setConceptos] = useState<Concepto[]>([]);
  const [selectedConcepto, setSelectedConcepto] = useState<Concepto | null>(null);
  const [inmuebles, setInmuebles] = useState<InmuebleConcepto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchConceptos = async (filter: string = '') => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Conceptos_inmueble/GetAllConceptos?filterConcepto=${filter}`
      );
      setConceptos(response.data);
    } catch (error) {
      console.error('Error al obtener conceptos:', error);
    }
  };

  const fetchInmueblesByConcepto = async (codConcepto: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Inmuebles/GetInmueblesByConcepto?cod_concepto=${codConcepto}`
      );
      setInmuebles(response.data);
    } catch (error) {
      console.error('Error al obtener inmuebles:', error);
    }
  };

  useEffect(() => {
    fetchConceptos();
  }, []);

  const handleConceptoChange = (event: any, newValue: Concepto | null) => {
    setSelectedConcepto(newValue);
    if (newValue) {
      fetchInmueblesByConcepto(newValue.codigo);
    } else {
      setInmuebles([]);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToPDF = () => {
    const element = contentRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `conceptos_${selectedConcepto?.descripcion || 'reporte'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const styles = `
    .pdf-content {
      padding: 10px;
    }

    .pdf-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 15px;
    }

    .pdf-logo {
      height: 60px;
    }

    .pdf-titles {
      flex-grow: 1;
    }

    .pdf-main-title {
      font-size: 18px;
      margin: 0;
    }

    .pdf-subtitle {
      font-size: 16px;
      margin: 5px 0 0 0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8px;
    }

    .data-table th {
      background-color: #f5f5f5;
      padding: 4px;
      border: 1px solid #ddd;
      font-weight: bold;
      white-space: nowrap;
    }

    .data-table td {
      padding: 3px;
      border: 1px solid #ddd;
      white-space: nowrap;
    }

    @media print {
      .data-table {
        font-size: 8px;
      }
      
      .data-table th,
      .data-table td {
        padding: 3px;
      }
      
      .pdf-main-title {
        font-size: 16px;
      }
      
      .pdf-subtitle {
        font-size: 14px;
      }
    }
  `;

  return (
    <div className="mt-16 ml-5 mr-5 mb-16">
      <style>{styles}</style>
      <Box mb={4}>
        <Autocomplete
          options={conceptos}
          getOptionLabel={(option) => `${option.descripcion} (${option.tipo})`}
          onChange={handleConceptoChange}
          onInputChange={(event, newInputValue) => {
            fetchConceptos(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Buscar Concepto" variant="outlined" fullWidth />
          )}
        />
      </Box>

      {selectedConcepto && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PdfIcon />}
              onClick={exportToPDF}
            >
              Exportar a PDF
            </Button>
          </Box>

          <div ref={contentRef} className="pdf-content">
            <div className="pdf-header">
              <img src={logoNotas} alt="Logo" className="pdf-logo" />
              <div className="pdf-titles">
                <h1 className="pdf-main-title">Inmuebles por Concepto</h1>
                <h2 className="pdf-subtitle">{selectedConcepto.descripcion} ({selectedConcepto.tipo})</h2>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cir</th>
                  <th>Secc</th>
                  <th>Manz</th>
                  <th>Parc</th>
                  <th>PH</th>
                  <th>Badec</th>
                  <th>Nombre</th>
                  <th>Fec. Alta</th>
                  <th>Activo</th>
                  <th>Año Desde-Hasta</th>
                  <th>Calle</th>
                  <th>Nro</th>
                  <th>%</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {inmuebles.map((inmueble, index) => (
                  <tr key={index}>
                    <td>{inmueble.circunscripcion}</td>
                    <td>{inmueble.seccion}</td>
                    <td>{inmueble.manzana}</td>
                    <td>{inmueble.parcela}</td>
                    <td>{inmueble.p_h || '-'}</td>
                    <td>{inmueble.nro_bad}</td>
                    <td>{inmueble.nombre}</td>
                    <td>
                      {inmueble.fecha_alta_registro
                        ? new Date(inmueble.fecha_alta_registro).toLocaleDateString('es-AR')
                        : '-'}
                    </td>
                    <td>{inmueble.activo ? 'Sí' : 'No'}</td>
                    <td>{`${inmueble.anio_desde}-${inmueble.anio_hasta}`}</td>
                    <td>{inmueble.nom_calle}</td>
                    <td>{inmueble.nro_dom_pf}</td>
                    <td>{`${inmueble.porcentaje}%`}</td>
                    <td>${inmueble.monto.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PorConceptos;
