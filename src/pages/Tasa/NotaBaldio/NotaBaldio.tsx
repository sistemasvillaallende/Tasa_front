import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasaContext } from '../../../context/TasaProvider';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import {
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import logoMunicipalidad from '../../../assets/logo-notas.png';

interface BaldioData {
  nombre: string;
  nro_bad: number;
  circunscripcion: number;
  seccion: number;
  manzana: number;
  parcela: number;
  p_h: number;
  calle: string;
  nro: number;
  barrio: string;
  cod_postal: string;
  domicilio: string;
  ciudad: string;
  provincia_dom_esp: string;
  pais_dom_esp: string;
}

const NotaBaldio = () => {
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams();
  const { inmuebles, setInmuebles } = useTasaContext();
  const [baldioData, setBaldioData] = useState<BaldioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(null);
  const navigate = useNavigate();

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
        } else if (id) {
          inmuebleData = inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id);
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

        // Obtener datos del baldío
        const baldioResponse = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Inmuebles/GetDatosBaldio`, {
          params: {
            cir: inmuebleData.circunscripcion,
            sec: inmuebleData.seccion,
            man: inmuebleData.manzana,
            par: inmuebleData.parcela,
            p_h: inmuebleData.p_h || 0
          }
        }
        );
        setBaldioData(baldioResponse.data);

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

    fetchData();
  }, [circunscripcion, seccion, manzana, parcela, p_h, id]);

  const exportToPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 1,
      filename: `nota_baldio_${baldioData?.circunscripcion}_${baldioData?.seccion}_${baldioData?.manzana}_${baldioData?.parcela}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (isLoading) {
    return <Typography>Cargando datos...</Typography>;
  }

  if (!baldioData) {
    return <Typography>No se encontraron datos del baldío</Typography>;
  }

  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fechaActual);
  const año = fechaActual.getFullYear();

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
            <Typography variant="h6">DIRECCIÓN DE AMBIENTE</Typography>
          </Box>
        </Box>

        <Box mb={2}>
          <Typography>Villa Allende, {dia} de {mes} de {año}</Typography>
          <Typography>Ref: BALDIO SUCIO Nom. Cat. {baldioData.circunscripcion.toString().padStart(2, '0')}-{baldioData.seccion.toString().padStart(2, '0')}-{baldioData.manzana.toString().padStart(3, '0')}-{baldioData.parcela.toString().padStart(3, '0')}-{baldioData.p_h.toString().padStart(3, '0')}</Typography>
        </Box>

        <Box mb={4}>
          <Typography>SR/A {baldioData.nombre}</Typography>
          <Typography>{baldioData.domicilio}</Typography>
          <Typography>{baldioData.ciudad}</Typography>
          <Typography>{baldioData.provincia_dom_esp}</Typography>
        </Box>

        <Typography paragraph style={{ textAlign: 'justify' }}>
          La Dirección de Ambiente de la Municipalidad de Villa Allende se dirige a Ud. con
          motivo de informarle que continúa en vigencia la Ord. 89/73, la cual establece la
          obligación de los propietarios de los terrenos ubicados en las zonas urbanizadas y
          residenciales de la Villa, así como también sus veredas, de mantenerlos
          permanentemente limpios, libres de residuos, malezas, y de animales e insectos
          que transmiten enfermedades infectocontagiosas. Esto deberá ser realizado por cuenta
          y cargo del propietario del inmueble.
        </Typography>

        <Typography paragraph style={{ textAlign: 'justify' }}>
          Además, la Ord. N° 575/85 establece que "el infractor de la presente norma será
          emplazado por los inspectores municipales al labrarse el acta de constatación para
          que la cumpla dentro del plazo perentorio de diez (10) días bajo apercibimiento de
          aplicar multa (…)".
        </Typography>

        <Typography paragraph style={{ textAlign: 'justify' }}>
          En este sentido, le solicitamos realice el mantenimiento y desmalezado del lote
          designado catastralmente {baldioData.circunscripcion}-{baldioData.seccion}-{baldioData.manzana}-{baldioData.parcela}-{baldioData.p_h},
          ubicado en {baldioData.calle} {baldioData.nro} de {baldioData.barrio}, para así lograr que nuestra
          ciudad se convierta en un lugar que merezca ser vivido.
        </Typography>

        <Typography paragraph mt={4}>
          Sin otro particular, lo saluda atentamente.
        </Typography>
      </Paper>
    </div>
  );
};

export default NotaBaldio; 