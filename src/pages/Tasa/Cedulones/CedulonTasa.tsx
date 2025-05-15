import React, { useEffect, useRef, useState } from "react"
import Barcode from "react-barcode"
import html2canvas from "html2canvas"
import "../../../assets/css/style.css"
import jsPDF from "jspdf"
import axios from "axios"
import { useParams } from "react-router-dom"
import { convertirFecha, fechaActual } from "../../../utils/GeneralUtils"
import { useCedulonesContext } from "../../../context/CedulonesProviders"
import { currencyFormat } from "../../../utils/helper"
import { CabeceraDeCedulon, DetalleCedulon } from "../../../interfaces/Inmueble"
import html2pdf from "html2pdf.js"
import logo from '../../../assets/logo2.png'
import { Box, Container, Paper } from '@mui/material';
import Button from "@mui/material/Button";
import "./cedulones.css";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


// Crear un componente que representa el documento PDF

const CedulonTasa = () => {
  const { cedulonParaImpresion } = useCedulonesContext()
  const { nrocedulon } = useParams()
  const [cabecera, setCabecera] = useState<CabeceraDeCedulon>()
  const [detalle, setDetalle] = useState<DetalleCedulon[]>([])
  const [subTotal, setSubTotal] = useState<number>(0)
  const [interesMoraTotal, setInteresMoraTotal] = useState<number>(0)
  const [descuentoTotal, setDescuentoTotal] = useState<number>(0)
  const [barcodeData, setBarcodeData] = useState<string>()
  const [costoFinancieroTotal, setCostoFinancieroTotal] = useState<number>(0)

  useEffect(() => {
    if (nrocedulon) {
      obtenerCabecera(parseInt(nrocedulon))
      obtenerDetalle(parseInt(nrocedulon))
    }
    // console.log(cedulonParaImpresion)
  }, [nrocedulon])

  const obtenerCabecera = (nrocedulon: number) => {
    const urlApi = `${import.meta.env.VITE_URL_CEDULONES
      }getCabeceraPrintCedulonTasa?nroCedulon=${nrocedulon}`
    axios
      .get(urlApi)
      .then((response) => {
        setCabecera(response.data)
        setBarcodeData(`C0${nrocedulon}`)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const obtenerDetalle = (nrocedulon: number) => {
    const urlApi = `${import.meta.env.VITE_URL_CEDULONES
      }getDetallePrintCedulonTasa?nroCedulon=${nrocedulon}`
    axios
      .get(urlApi)
      .then((response) => {
        setDetalle(response.data)
        calcularTotales(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const calcularTotales = (detalles: DetalleCedulon[]) => {
    let subTotal = 0
    let interesPorMora = 0
    let montoOriginal = 0
    let montoPagado = 0
    let descuentos = 0
    detalles.forEach((detalle: DetalleCedulon) => {
      subTotal += detalle.montoOriginal
      interesPorMora += detalle.recargo
      montoOriginal += detalle.montoOriginal
      montoPagado += detalle.montoPagado
      descuentos += detalle.descInteres
    })
    setSubTotal(subTotal)
    setInteresMoraTotal(interesPorMora)
    setDescuentoTotal(descuentos)
  }

  const divRef = useRef(null)
  const generatePDF = () => {
    const element = divRef.current

    if (element !== null) {
      const opt = {
        margin: [10, 0, 10, 0],
        filename: `cedulon_${nrocedulon}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true,
          scrollY: 0,
          windowHeight: document.documentElement.scrollHeight
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
          hotfixes: ["px_scaling"]
        },
        pagebreak: {
          mode: ['avoid-all'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['tr', '.cupon', '.tm_invoice_head']
        }
      }

      html2pdf()
        .set(opt)
        .from(element)
        .save()
    }
  }


  return (
    <Container maxWidth="lg" sx={{ py: 15 }}>

      {/* Solo botón de PDF */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PictureAsPdfIcon />}
          onClick={generatePDF}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            boxShadow: 2,
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          Descargar PDF
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          backgroundColor: 'white',
          p: 2,
          mx: 'auto',
          width: '210mm', // Ancho A4
          minHeight: '297mm', // Alto A4
          '@media print': {
            boxShadow: 'none',
            p: 0
          }
        }}
      >
        <div
          ref={divRef}
          style={{
            transform: 'scale(0.9)',
            transformOrigin: 'top center',
            width: '100%',
            height: '100%'
          }}
          className="p-5 flex flex-col justify-between h-full"
        >
          {/* Contenido principal */}
          <div className="flex-grow">
            <div
              id="tm_download_section"
              className="bg-white mx-auto max-w-full text-sm"
            >
              <div className="flex flex-col">
                {/* Contenido del cedulón */}
                <div className="tm_invoice_in">
                  <div className="flex w-full">
                    <div className="w-3/12">
                      <img src={logo} alt="Logo" />
                    </div>
                    <div className="w-9/12">
                      <Barcode
                        fontSize={14}
                        width={1.4}
                        height={50}
                        textAlign="center"
                        marginLeft={80}
                        value="05490000000000000082291020208650026052025000000109"
                        format="CODE128"
                      />
                    </div>
                  </div>

                  <div className="flex bg-gray-100 p-2 mb-2">
                    <div className="w-3/4">
                      <p>Nro. Comprobante: {cabecera?.nroCedulon}</p>
                      <p>Fecha Emisión: {fechaActual()}</p>
                      <p>
                        Fecha Vencimiento:{' '}
                        {cabecera?.vencimiento
                          ? convertirFecha(cabecera.vencimiento)
                          : ''}
                      </p>
                    </div>

                    <div className="text-xl -1/3">
                      Total: {currencyFormat(cabecera?.montoPagar || 0)}
                    </div>
                  </div>

                  <div className="tm_table tm_style1 tm_mb30">
                    <div className="tm_border  tm_accent_border_20 tm_border_top_0">
                      <div className="tm_table_responsive">
                        <table>
                          <tbody>
                            <tr>
                              <td className="tm_width_6 tm_border_top_0">
                                <b className="tm_primary_color tm_medium">Contribuyente: </b>
                                {cabecera?.nombre}
                              </td>
                              <td className="tm_width_6 tm_border_top_0 tm_border_left tm_accent_border_20">
                                <b className="tm_primary_color tm_medium">Dirección: </b>{" "}
                                {cabecera?.detalle}
                              </td>
                            </tr>
                            <tr>
                              <td className="tm_width_6 tm_accent_border_20">
                                <b className="tm_primary_color tm_medium">CUIT: </b>
                                {cabecera?.cuit}
                              </td>
                              <td className="tm_width_6 tm_border_left tm_accent_border_20">
                                <b className="tm_primary_color tm_medium">Denominación: </b>
                                {cabecera?.denominacion}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 mb-3">
                    <div className="flex flex-col border border-gray-300 mb-2">
                      {/* Encabezado */}
                      <div className="flex bg-gray-100">
                        <div className="w-1/6 p-2 font-semibold text-gray-700">
                          Periodo
                        </div>
                        <div className="w-4/6 p-2 font-semibold text-gray-700 ">
                          Concepto
                        </div>
                        <div className="w-1/6 p-2 font-semibold text-gray-700 text-right">
                          Sub Total
                        </div>
                      </div>

                      {/* Cuerpo */}
                      {detalle.map((item, index) => (
                        <div
                          key={index}
                          className={`flex ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        >
                          <div className="w-1/6 p-2 border-t border-gray-300">
                            {item.periodo}
                          </div>
                          <div className="w-4/6 p-2 border-t border-gray-300">
                            {item.concepto}
                          </div>
                          <div className="w-1/6 p-2 border-t border-gray-300 text-right">
                            {currencyFormat(item.montoPagado)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="tm_invoice_footer tm_mb15 tm_m0_md">
                      <div className="tm_left_footer">
                        <p className="font-bold mt-2 text-lg">
                          Cedulon valido solo para pago en caja Municipal
                        </p>
                        <p className="text-sm mt-2">
                          Medio de Pago: {cedulonParaImpresion?.tarjetaDeCredito} <br />
                          en {cedulonParaImpresion?.cantCuotas} Cuotas de{" "}
                          {currencyFormat(cedulonParaImpresion?.montoCuota || 0)}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                          <div className="flex-1 text-gray-700 font-medium">Sub total</div>
                          <div className="flex-1 text-right text-gray-700 font-medium">
                            {currencyFormat(subTotal)}
                          </div>
                        </div>

                        {/* Interés Mora */}
                        <div className="flex justify-between items-center">
                          <div className="flex-1 text-gray-700">Interes Mora</div>
                          <div className="flex-1 text-right text-gray-700">
                            {currencyFormat(interesMoraTotal)}
                          </div>
                        </div>

                        {/* Descuento */}
                        <div className="flex justify-between items-center">
                          <div className="flex-1 text-gray-700">Descuento</div>
                          <div className="flex-1 text-right text-gray-700">
                            {currencyFormat(descuentoTotal)}
                          </div>
                        </div>

                        {/* Costo Financiero */}
                        <div className="flex justify-between items-center">
                          <div className="flex-1 text-gray-700">Costo financiero:</div>
                          <div className="flex-1 text-right text-gray-700">
                            {currencyFormat(costoFinancieroTotal)}
                          </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center bg-gray-100 border-t border-gray-300 py-2">
                          <div className="flex-1 font-bold text-lg text-gray-800">Total</div>
                          <div className="flex-1 text-right font-bold text-lg text-gray-800">
                            {currencyFormat(cabecera?.montoPagar ?? 0)}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Talonario */}
            <div className="flex text-xs mb-2">
              <div className="w-1/2 pl-2">CUPON MUNICIPALIDAD</div>
              <div className="w-1/2 pl-2">CUPON CONTRIBUYENTE</div>
            </div>

            <div className="mt-auto flex border border-gray-500">
              {/* Primer cupón */}
              <div className="flex flex-col w-1/2 border-r border-gray-500">
                {/* Encabezado con logo y título */}
                <div className="flex w-full border-b border-gray-500">
                  <img
                    style={{ maxHeight: '50px' }}
                    src={logo}
                    alt="Logo Notas"
                  />
                  <div className="flex flex-col justify-center items-center w-full">
                    <p>TASA AL INMUEBLE</p>
                  </div>
                </div>

                {/* Datos del contribuyente */}
                <div className="grid grid-cols-2 p-2 text-sm leading-tight">
                  <div className="font-semibold">Contribuyente:</div>
                  <div>{cabecera?.nombre}</div>
                  <div className="font-semibold">Dirección:</div>
                  <div>{cabecera?.detalle}</div>
                  <div className="font-semibold">CUIT:</div>
                  <div>{cabecera?.cuit}</div>
                  <div className="font-semibold">Vencimiento:</div>
                  <div>{cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ''}</div>
                  <div className="font-semibold">Total:</div>
                  <div>{currencyFormat(cabecera?.montoPagar || 0)}</div>
                </div>

                {/* Código de barras */}
                <div className="flex justify-center p-2">
                  <Barcode
                    fontSize={14}
                    width={1.2}
                    height={40}
                    value={barcodeData}
                    format="CODE39"
                  />
                </div>
              </div>

              {/* Segundo cupón */}
              <div className="flex flex-col w-1/2">
                <div className="flex w-full border-b border-gray-500">
                  <img
                    style={{ maxHeight: '50px' }}
                    src={logo}
                    alt="Logo Notas"
                  />
                  <div className="flex flex-col justify-center items-center w-full">
                    <p>TASA AL INMUEBLE</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 p-2 text-sm leading-tight">
                  <div className="font-semibold">Contribuyente:</div>
                  <div>{cabecera?.nombre}</div>
                  <div className="font-semibold">Dirección:</div>
                  <div>{cabecera?.detalle}</div>
                  <div className="font-semibold">CUIT:</div>
                  <div>{cabecera?.cuit}</div>
                  <div className="font-semibold">Vencimiento:</div>
                  <div>{cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ''}</div>
                  <div className="font-semibold">Total:</div>
                  <div>{currencyFormat(cabecera?.montoPagar || 0)}</div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </Paper>
    </Container>
  )
}
export default CedulonTasa
