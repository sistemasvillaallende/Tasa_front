import React, { useEffect, useState, useRef } from 'react';
import { useTasaContext } from '../../../context/TasaProvider';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import logoMunicipalidad from '../../../assets/logo-notas.png';

interface ConexionAguaData {
  nombre: string;
  circunscripcion: number;
  seccion: number;
  manzana: number;
  parcela: number;
  p_h: number;
  nom_calle: string;
  nro_dom_pf: number;
  nom_barrio: string;
  manzana_oficial: string;
  lote_oficial: string;
  superficie: number;
  domicilio: string;
  dia_actual: number;
  mes_actual: string;
  anio_actual: number;
}

const ConexionAgua = () => {
  const { selectedInmueble, searchForm, setSearch } = useTasaContext();
  const [conexionData, setConexionData] = useState<ConexionAguaData | null>(null);
  const contentRef = useRef(null);

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

  useEffect(() => {
    const fetchConexionAgua = async () => {
      if (!selectedInmueble) return;

      const { circunscripcion, seccion, manzana, parcela, p_h } = selectedInmueble;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Inmuebles/GetDatosConexionAgua?cir=${circunscripcion}&sec=${seccion}&man=${manzana}&par=${parcela}&p_h=${p_h || 0}`
        );
        setConexionData(response.data);
      } catch (error) {
        console.error('Error al obtener datos de conexión:', error);
      }
    };

    fetchConexionAgua();
  }, [selectedInmueble]);

  const exportToPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: `conexion_agua_${conexionData?.circunscripcion}_${conexionData?.seccion}_${conexionData?.manzana}_${conexionData?.parcela}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!conexionData) {
    return <Typography>Cargando datos de conexión...</Typography>;
  }

  return (
    <div className="mt-16 ml-5 mr-5 mb-16">
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

      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }} ref={contentRef}>
        <Box mb={3} display="flex" alignItems="flex-start">
          <Box mr={3}>
            <img
              src={logoMunicipalidad}
              alt="Logo Municipalidad"
              style={{
                height: '100px',
                width: 'auto'
              }}
            />
          </Box>
          <Box>
            <Typography variant="h6">SECRETARÍA DE OBRAS PÚBLICAS</Typography>
            <Typography variant="h6">OFICINA DE CATASTRO</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box mb={4}>
          <Typography variant="h5" align="center" gutterBottom>
            AUTORIZACIÓN PARA CONEXIÓN DE AGUA
          </Typography>
        </Box>

        <Typography paragraph>
          Certifico: Que el inmueble de propiedad <strong>{conexionData?.nombre}</strong> ubicado
          en {conexionData?.nom_calle} {conexionData?.nro_dom_pf}, B° {conexionData?.nom_barrio}, designado catastralmente
          como C: {conexionData?.circunscripcion} S:{conexionData?.seccion} M:{conexionData?.manzana} P:{conexionData?.parcela}{' '}
          {conexionData?.p_h > 0 ? `P_H:${conexionData?.p_h}` : ''}
          {conexionData?.manzana_oficial ? ` -Manzana Oficial: ${conexionData?.manzana_oficial}` : ''}{' '}
          {conexionData?.lote_oficial ? `Lote Oficial: ${conexionData?.lote_oficial}` : ''} Superficie {conexionData?.superficie} mts²,
          está autorizado a conectarse a la red de agua.
        </Typography>

        <Typography paragraph mt={4}>
          Para ser presentado ante la Cooperativa de Obras y Serv. Públicos de Villa Allende Ltda.,
          se extiende la presente en la ciudad de Villa Allende, a los {conexionData?.dia_actual} días
          del mes de {conexionData?.mes_actual} del año {conexionData?.anio_actual}.
        </Typography>
      </Paper>
    </div>
  );
};

export default ConexionAgua; 