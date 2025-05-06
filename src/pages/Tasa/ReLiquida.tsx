import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { ReLiquidacion } from "../../interfaces/Inmueble";
import { useUserContext } from "../../context/UserProvider";
import { useTasaContext } from "../../context/TasaProvider";
import { formatNumberToARS, formatDateToDDMMYYYY } from "../../utils/Operaciones";

const ReLiquida = () => {
  const [reLiquidaciones, setReLiquidaciones] = useState<ReLiquidacion[]>([]);
  const [reLiquidacionesSeleccionadas, setReLiquidacionesSeleccionadas] = useState<Set<number>>(new Set());
  const [isReliquidado, setIsReliquidado] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams();
  const { inmuebles, setInmuebles } = useTasaContext();
  const [detalleInmueble, setDetalleInmueble] = useState<any>(null);

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        let inmuebleData;

        if (circunscripcion) {
          const response = await axios.get(
            `${import.meta.env.VITE_URL_BASE}Inmuebles/getByPk`,
            {
              params: { circunscripcion, seccion, manzana, parcela, p_h },
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
          });
          navigate("/");
          return;
        }

        setDetalleInmueble(inmuebleData);

        const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/Listar_periodos_a_reliquidar`;
        const response = await axios.get(apiUrl, {
          params: {
            cir: inmuebleData.circunscripcion,
            sec: inmuebleData.seccion,
            man: inmuebleData.manzana,
            par: inmuebleData.parcela,
            p_h: inmuebleData.p_h,
          },
        });
        setReLiquidaciones(response.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
        navigate("/");
      }
    };

    fetchInmueble();
  }, [circunscripcion, seccion, manzana, parcela, p_h, id]);

  const handleCheckboxChange = (index: number) => {
    setReLiquidacionesSeleccionadas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIndexes = reLiquidaciones.map((_, index) => index);
      setReLiquidacionesSeleccionadas(new Set(allIndexes));
    } else {
      setReLiquidacionesSeleccionadas(new Set());
    }
  };

  const handleReliquidar = async () => {
    if (!detalleInmueble || reLiquidacionesSeleccionadas.size === 0) {
      Swal.fire({
        title: "Error",
        text: "Debe seleccionar al menos un período para reliquidar.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
      return;
    }

    try {
      const periodosAReliquidar = Array.from(reLiquidacionesSeleccionadas).map((index) => {
        const periodo = reLiquidaciones[index];
        return {
          tipo_transaccion: periodo.tipo_transaccion,
          nro_transaccion: periodo.nro_transaccion || 0,
          circunscripcion: detalleInmueble.circunscripcion,
          seccion: detalleInmueble.seccion,
          manzana: detalleInmueble.manzana,
          parcela: detalleInmueble.parcela,
          p_h: detalleInmueble.p_h,
          periodo: periodo.periodo,
          debe: periodo.debe || 0,
          monto_original: periodo.monto_original || 0,
          vencimiento: periodo.vencimiento,
        };
      });

      const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/Reliquidar_periodos`;
      await axios.post(apiUrl, periodosAReliquidar, {
        params: {
          cir: detalleInmueble.circunscripcion,
          sec: detalleInmueble.seccion,
          man: detalleInmueble.manzana,
          par: detalleInmueble.parcela,
          p_h: detalleInmueble.p_h,
        },
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire({
        title: "Reliquidación Exitosa",
        text: "Los períodos seleccionados han sido reliquidados correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });

      setIsReliquidado(true);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al reliquidar los períodos.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      });
    }
  };

  const handleConfirmar = async () => {
    const totalMonto = Array.from(reLiquidacionesSeleccionadas).reduce(
      (acc, index) => acc + (reLiquidaciones[index]?.monto_original || 0),
      0
    );
    const totalDebe = Array.from(reLiquidacionesSeleccionadas).reduce(
      (acc, index) => acc + (reLiquidaciones[index]?.debe || 0),
      0
    );

    const { value: observaciones } = await Swal.fire({
      title: "Autorización",
      html: `
        <div class="text-left">
          <p class="font-bold">Totales:</p>
          <p>Monto: $ ${totalMonto.toFixed(2)}</p>
          <p>Debe: $ ${totalDebe.toFixed(2)}</p>
        </div>
      `,
      input: "textarea",
      inputPlaceholder: "Ingrese observaciones",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#27a3cf",
      cancelButtonColor: "#d33",
    });

    if (observaciones) {
      try {
        const consulta = {
          cir: detalleInmueble.circunscripcion,
          sec: detalleInmueble.seccion,
          man: detalleInmueble.manzana,
          par: detalleInmueble.parcela,
          p_h: detalleInmueble.p_h,
          lstCtasTes: Array.from(reLiquidacionesSeleccionadas).map((index) => reLiquidaciones[index]),
          auditoria: {
            id_auditoria: 0,
            fecha: new Date().toISOString(),
            usuario: user?.userName,
            proceso: "Reliquidación de deuda",
            identificacion: "string",
            autorizaciones: "string",
            observaciones,
            detalle: "string",
            ip: "string",
          },
        };

        const apiUrl = `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/Confirma_reliquidacion`;
        await axios.post(apiUrl, consulta, {
          headers: { "Content-Type": "application/json" },
        });

        Swal.fire({
          title: "Confirmación Exitosa",
          text: "La reliquidación ha sido confirmada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });

        setReLiquidacionesSeleccionadas(new Set());
        setIsReliquidado(false);
        navigate(`/detalle/${detalleInmueble.circunscripcion}/${detalleInmueble.seccion}/${detalleInmueble.manzana}/${detalleInmueble.parcela}/${detalleInmueble.p_h}`);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error al confirmar la reliquidación.",
          icon: "error",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        });
      }
    }
  };

  return (
    <div className="paginas">
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        {/* Tabla Izquierda */}
        <Box sx={{ flex: 1, minWidth: "45%" }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>Períodos a Reliquidar</Box>
            </Box>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          reLiquidacionesSeleccionadas.size > 0 &&
                          reLiquidacionesSeleccionadas.size < reLiquidaciones.length
                        }
                        checked={
                          reLiquidacionesSeleccionadas.size === reLiquidaciones.length &&
                          reLiquidaciones.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Período</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="right">Debe</TableCell>
                    <TableCell>Vto.</TableCell>
                    <TableCell>Tipo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reLiquidaciones.map((liquidacion, index) => (
                    <TableRow
                      key={index}
                      hover
                      selected={reLiquidacionesSeleccionadas.has(index)}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={reLiquidacionesSeleccionadas.has(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </TableCell>
                      <TableCell>{liquidacion.periodo}</TableCell>
                      <TableCell align="right">{formatNumberToARS(liquidacion.monto_original)}</TableCell>
                      <TableCell align="right">{formatNumberToARS(liquidacion.debe)}</TableCell>
                      <TableCell>{formatDateToDDMMYYYY(liquidacion.vencimiento)}</TableCell>
                      <TableCell>{liquidacion.tipo_deuda}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Botones */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleReliquidar}
            disabled={reLiquidacionesSeleccionadas.size === 0}
          >
            Reliquidar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmar}
            disabled={!isReliquidado}
          >
            Confirmar
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ReLiquida;
