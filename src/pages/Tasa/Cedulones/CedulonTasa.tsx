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
import Button from "../../../base-components/Button"
import html2pdf from "html2pdf.js"
import logoNotas from '../../../assets/logo-notas.png'
// Crear un componente que representa el documento PDF

const CedulonTasa = () => {
  const { cedulonParaImpresion } = useCedulonesContext()
  const { nrocedulon } = useParams()
  const [cabecera, setCabecera] = useState<CabeceraDeCedulon>()
  const [detalle, setDetalle] = useState<DetalleCedulon[]>([])
  const [subTotal, setSubTotal] = useState<number>(0)
  const [interesMoraTotal, setInteresMoraTotal] = useState<number>(0)
  const [descuentoTotal, setDescuentoTotal] = useState<number>(0)
  const [barcodeData, setBarcodeData] = useState<number>()
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
        setBarcodeData(response.data?.codigo_barra)
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

  // Estilos CSS adicionales para mejorar la apariencia del cedulón
  const styles = `
  .tm_container {
    width: 210mm; /* A4 width */
    height: auto;
    min-height: 297mm; /* A4 height */
    padding: 20mm; /* Add padding for better spacing */
    margin: 0 auto; /* Center the content */
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    font-size: 13px; /* Reduce font size globally */
  }

  .tm_invoice_wrap {
    width: 100%;
    background: #fff;
    padding: 0;
    margin: 0;
    page-break-inside: avoid;
  }

  .tm_invoice {
    width: 100%;
    padding: 10px;
    margin: 0;
    page-break-inside: avoid;
  }

  .tm_invoice_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px; /* Add spacing below the header */
  }

  .tm_logo img {
    max-height: 80px; /* Larger logo */
    object-fit: contain;
    margin: 0;
  }

  .tm_barcode {
    text-align: right;
  }

  .tm_barcode_number {
    margin-top: 5px;
    font-size: 10px; /* Reduce font size */
    text-align: center;
    color: #333;
  }

  .tm_table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0; /* Add spacing between tables */
  }

  .tm_table th,
  .tm_table td {
    padding: 8px; /* Reduce padding */
    border: 1px solid #e5e5e5;
    text-align: left;
    font-size: 10px; /* Reduce font size */
  }

  .tm_invoice_footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 30px; /* Add spacing above footer */
    font-size: 10px; /* Reduce font size */
  }

  .tm_left_footer {
    flex: 1;
  }

  .tm_right_footer {
    flex: 1;
    text-align: right;
  }

  .tm_primary_color {
    color: #27a3cf;
  }

  .tm_accent_color {
    color: #333;
  }

  .tm_section_heading {
    margin: 30px 0; /* Add spacing above and below section headings */
    padding: 10px;
    background: #f8f9fa;
    border-left: 4px solid #27a3cf;
    font-size: 12px; /* Reduce font size */
  }

  @media print {
    @page {
      size: A4;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
    }

    .tm_container {
      width: 210mm;
      height: auto;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
    }

    .no-print {
      display: none;
    }
  }
`

  // Agregar los estilos al documento
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  return (
    <>
      <div ref={divRef}>
        <div className="tm_container">
          <div className="tm_invoice_wrap">
            <div className="tm_invoice tm_style2 tm_type1 tm_accent_border tm_radius_0 tm_small_border">
              <div className="tm_invoice_in">
                <div className="tm_invoice_head">
                  {/* Municipality Logo */}
                  <div className="tm_logo">
                    <img
                      src={logoNotas}
                      alt="Logo Municipalidad"
                    />
                  </div>
                  {/* Barcode and Cedulon Number */}
                  <div className="tm_barcode">
                    <Barcode
                      value={nrocedulon || ""}
                      format="CODE39"
                      width={1.5}
                      height={50}
                      displayValue={false}
                    />
                    <div className="tm_barcode_number">C0{nrocedulon}</div>
                  </div>
                </div>
                <div className="tm_invoice_info tm_mb30 tm_align_center">
                  <div className="tm_invoice_info_left tm_mb20_md">
                    <p className="tm_mb0">
                      Nro. Comprobante: <b className="tm_primary_color">{cabecera?.nroCedulon}</b>
                      <br />
                      Fecha Emisión: <b className="tm_primary_color">{fechaActual()}</b>
                      <br />
                      Fecha Vencimiento:{" "}
                      <b className="tm_primary_color">
                        {cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ""}
                      </b>
                    </p>
                  </div>
                  <div className="tm_invoice_info_right">
                    <div className="tm_border tm_accent_border_20 tm_radius_0 tm_accent_bg_10 tm_curve_35 tm_text_center">
                      <div>
                        <b className="tm_accent_color tm_f26 tm_medium tm_body_lineheight">
                          Total: $ {cabecera?.montoPagar}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="tm_f16 tm_section_heading tm_accent_border_20 tm_mb0">
                  <span className="tm_accent_bg_10 tm_radius_0 tm_curve_35 tm_border tm_accent_border_20 tm_border_bottom_0 tm_accent_color">
                    <span>Tasa al inmueble</span>
                  </span>
                </h2>
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
                <div className="tm_table tm_style1">
                  <div className="tm_border tm_accent_border_20">
                    <div className="tm_table_responsive">
                      <table>
                        <thead>
                          <tr>
                            <th className="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10">
                              Periodo
                            </th>
                            <th className="tm_width_3 tm_semi_bold tm_accent_color tm_accent_bg_10">
                              Concepto
                            </th>
                            <th className="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10 tm_text_right">
                              Sub Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalle.map((item, index) => {
                            return (
                              <tr key={index} style={{ lineHeight: "1", padding: "2px 0" }}>
                                <td className="tm_width_1 tm_accent_border_20">{item.periodo}</td>
                                <td className="tm_width_3 tm_accent_border_20">{item.concepto}</td>
                                <td className="tm_width_1 tm_accent_border_20 tm_text_right">
                                  {currencyFormat(item.montoPagado)}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tm_invoice_footer tm_mb15 tm_m0_md">
                    <div className="tm_left_footer">
                      <p className="tm_mb2">
                        <b className="tm_primary_color" style={{ fontSize: "16px" }}>
                          Cedulon valido solo para pago en caja Municipal
                        </b>
                      </p>
                      <p className="tm_m0" style={{ fontSize: "14px", marginTop: "10px" }}>
                        Medio de Pago <br />
                        {cedulonParaImpresion?.tarjetaDeCredito}
                        <br />
                        en {cedulonParaImpresion?.cantCuotas} Cuotas de{" "}
                        {currencyFormat(cedulonParaImpresion?.montoCuota || 0)}
                      </p>
                    </div>
                    <div className="tm_right_footer">
                      <table className="tm_mb15 tm_m0_md">
                        <tbody>
                          <tr>
                            <td className="tm_width_3 tm_primary_color tm_border_none tm_medium">
                              Sub total
                            </td>
                            <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_medium">
                              {currencyFormat(subTotal)}
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                              Interes Mora
                            </td>
                            <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                              {currencyFormat(interesMoraTotal)}
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                              Descuento
                            </td>
                            <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                              {currencyFormat(descuentoTotal)}
                            </td>
                          </tr>
                          <tr>
                            <td className="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                              Costo financiero:
                            </td>
                            <td className="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                              ${currencyFormat(costoFinancieroTotal)}
                            </td>
                          </tr>
                          <tr className="tm_accent_border_20 tm_border">
                            <td className="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_accent_bg_10">
                              Total{" "}
                            </td>
                            <td className="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_text_right tm_accent_bg_10">
                              {currencyFormat(cabecera?.montoPagar ?? 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="linea_puntos_horizontal"></div>
                <div className="cupones_container">
                  <div className="linea_puntos_vertical"></div>

                  <div className="talon" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <div className="cupon" style={{ flex: "1", margin: "0 10px", lineHeight: "1.2" }}>
                      <div className="cupon_header" style={{ marginTop: "20px", marginBottom: "20px" }}>
                        CUPON MUNICIPALIDAD TASA AL INMUEBLE
                      </div>
                      <div className="cupon_content">
                        <div className="cupon_data">
                          <div className="tm_logo">
                            <img
                              src={logoNotas}
                              alt="Logo Notas"
                              className="cupon_logo"
                              width={180}
                            />
                          </div>
                        </div>
                        <div className="cupon_data">
                          <strong>Contribuyente:</strong> {cabecera?.nombre}<br />
                          <strong>Dirección:</strong> {cabecera?.detalle}<br />
                          <strong>CUIT:</strong> {cabecera?.cuit}
                        </div>
                        <div className="cupon_data">
                          <strong>Vencimiento:</strong> {cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ""}<br />
                          <strong>Total:</strong> ${cabecera?.montoPagar}
                        </div>
                        <div className="barcode_container">
                          <Barcode
                            value={barcodeData}
                            width={1.2}
                            height={40}
                            format="CODE128"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="cupon" style={{ flex: "1", margin: "0 10px", lineHeight: "1.2" }}>
                      <div className="cupon_header" style={{ marginTop: "20px", marginBottom: "20px" }}>
                        CUPON MUNICIPALIDAD - TASA AL INMUEBLE
                      </div>
                      <div className="cupon_content">
                        <div className="cupon_data">
                          <div className="tm_logo">
                            <img
                              src={logoNotas}
                              alt="Logo Notas"
                              className="cupon_logo"
                              width={180}
                            />
                          </div>
                        </div>
                        <div className="cupon_data">
                          <strong>Contribuyente:</strong> {cabecera?.nombre}<br />
                          <strong>Dirección:</strong> {cabecera?.detalle}<br />
                          <strong>CUIT:</strong> {cabecera?.cuit}
                        </div>
                        <div className="cupon_data">
                          <strong>Vencimiento:</strong> {cabecera?.vencimiento ? convertirFecha(cabecera.vencimiento) : ""}<br />
                          <strong>Total:</strong> ${cabecera?.montoPagar}
                        </div>
                        <div className="barcode_container">
                          <Barcode
                            value={barcodeData}
                            width={1.2}
                            height={40}
                            format="CODE128"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <div className="fixed bottom-7 right-7 text-xl flex gap-5 no-print">
        <Button variant="outline-secondary" onClick={() => window.history.back()}>
          Ir Atrás
        </Button>
        <Button variant="primary" onClick={generatePDF}>
          Imprimir
        </Button>
      </div>
    </>
  )
}
export default CedulonTasa
