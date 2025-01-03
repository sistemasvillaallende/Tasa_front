import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Table from "../../../base-components/Table"
import classNames from "classnames"
import { FormSelect, FormInput } from "../../../base-components/Form"
import Button from "../../../base-components/Button"
import Lucide from "../../../base-components/Lucide"
import Menu from "../../../base-components/Headless/Menu"
import { useTasaContext } from "../../../context/TasaProvider"
import ModalDetTransaccion from "./ModalDetTransaccion"
import ModalDetPago from "./ModalDetPago"
import ModalDetDeuda from "./ModalDetDeuda"
import ModalDetProcuracion from "./ModalDetProcuracion"
import ModalDetPlan from "./ModalDetPlan"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
// Interfaces de Cta. Cte.
import {
  Ctasctes,
  Combo,
  DetPago,
  DetDeuda,
  DetProcuracion,
  DetPlanPago,
} from "../../../interfaces/Ctasctes"

const CuentaCorriente = () => {
  const divRef = useRef(null)
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams()
  const { inmuebles, setInmuebles } = useTasaContext()
  const [detalleInmueble, setDetalleInmueble] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [autos, setAutos] = useState<Ctasctes[]>([])
  const [cate_deuda, setCate_deuda] = useState<Combo[]>([])
  const [filtro, setFiltro] = useState(1)
  const [cateDeuda, setcateDeuda] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [detalle, setDetalle] = useState<string>("")
  const [detallePago, setDetallePago] = useState<DetPago | null>(null)
  const [showModalPago, setShowModalPago] = useState(false)

  const [detalleDeuda, setDetalleDeuda] = useState<DetDeuda[]>([])
  const [showModalDeuda, setShowModalDeuda] = useState(false)

  const [detalleProcuracion, setDetalleProcuracion] = useState<DetProcuracion | null>()
  const [showModalProcuracion, setShowModalProcuracion] = useState(false)

  const [detallePlan, setDetallePlan] = useState<DetPlanPago | null>()
  const [showModalPlan, setShowModalPlan] = useState(false)

  const navigate = useNavigate()

  const handleCancelar = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetchInmueble = async () => {
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
          )
          inmuebleData = response.data
          setInmuebles([inmuebleData])
        } else if (id) {
          inmuebleData = inmuebles?.find((inmueble) => inmueble.nro_bad.toString() === id)
        }

        if (!inmuebleData) {
          navigate('/')
          return
        }

        setDetalleInmueble(inmuebleData)

        // Fetch cuenta corriente data
        const responseCtaCte = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/ListarCtacte`, {
          params: {
            cir: inmuebleData.circunscripcion,
            sec: inmuebleData.seccion,
            man: inmuebleData.manzana,
            par: inmuebleData.parcela,
            p_h: inmuebleData.p_h,
            tipo_consulta: 1,
            cate_deuda_desde: 1,
            cate_deuda_hasta: 1000
          }
        }
        )
        setAutos(responseCtaCte.data)

        // Fetch categorías
        const responseCategorias = await axios.get(
          `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/ListarCategoriasTasa`
        )
        setCate_deuda(responseCategorias.data)

      } catch (error) {
        console.error('Error:', error)
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInmueble()
  }, [circunscripcion, seccion, manzana, parcela, p_h, id])

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    setFiltro(Number.parseInt(value))
    let hasta = cateDeuda === 0 ? 20 : cateDeuda

    fetchCtaCte(Number.parseInt(value), cateDeuda, hasta)
  }

  function handleSelectChangeTipo(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = Number.parseInt(event.target.value)
    setcateDeuda(value)
    let hasta = value === 0 ? 20 : value

    fetchCtaCte(filtro, value, hasta)
  }

  const fetchCtaCte = async (tipoConsulta: number, cateDeudaDesde: number, cateDeudaHasta: number) => {
    if (!detalleInmueble) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_BASE}Ctasctes_inmuebles/ListarCtacte`, {
        params: {
          cir: detalleInmueble.circunscripcion,
          sec: detalleInmueble.seccion,
          man: detalleInmueble.manzana,
          par: detalleInmueble.parcela,
          p_h: detalleInmueble.p_h,
          tipo_consulta: tipoConsulta,
          cate_deuda_desde: cateDeudaDesde,
          cate_deuda_hasta: cateDeudaHasta
        }
      }
      )
      setAutos(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  let saldo_actualizado = 0
  if (autos.length > 0) {
    saldo_actualizado = autos[autos.length - 1].sub_total
  }
  const deudas = autos.filter(
    (objeto) =>
      objeto.des_movimiento.toLowerCase().includes("Deuda".toLowerCase()) && !objeto.pagado
  )
  const saldo_original = deudas.reduce((a, b) => a + b.monto_original, 0)
  function currencyFormat(num: number) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
  function handledet(tipo_transaccion: number, nro_transaccion: number) {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_CTACTE}Datos_transaccion?tipo_transaccion=` +
        tipo_transaccion +
        `&nro_transaccion=` +
        nro_transaccion
      )

      setDetalle(response.data)
    }

    fetchData()
    setShowModal(true)
  }
  function handledetPago(nro_cedulon: number, nro_transaccion: number) {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_CTACTE}DetallePago?nro_cedulon=` +
        nro_cedulon +
        `&nro_transaccion=` +
        nro_transaccion
      )

      setDetallePago(response.data)
    }

    fetchData()
    setShowModalPago(true)
  }
  function handledetDeuda(nro_transaccion: number) {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_CTACTE}DetalleDeuda?nro_transaccion=` + nro_transaccion
      )

      setDetalleDeuda(response.data)
    }

    fetchData()
    setShowModalDeuda(true)
  }
  function handledetProcuracion(nro_procuracion: number) {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_CTACTE}DetalleProcuracion?nro_proc=` + nro_procuracion
      )

      setDetalleProcuracion(response.data)
    }

    fetchData()
    setShowModalProcuracion(true)
  }
  function handledetPlan(nro_plan: number) {
    let url = `${import.meta.env.VITE_URL_CTACTE}DetallePlan?nro_plan=` + nro_plan
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDetallePlan(data)
        setShowModalPlan(true)
      })
      .catch((error) => console.error(error))
  }
  const generatePDF = () => {
    const doc = new jsPDF()

    // Obtén el elemento con el ID "informe"
    const element = divRef.current
    // Captura todo el contenido del div, incluido el contenido oculto debido al desplazamiento
    if (element != null) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")

        // Establece el ancho y alto de la imagen en el PDF para asegurarte de que se muestre completo
        const pdfWidth = 210 // Ancho de la página A4 en mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        // Agrega la imagen al documento PDF
        doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        doc.save("informe.pdf")
      })
    }
  }
  return (
    <>
      <div className="h-full" style={{ padding: "25px" }}>
        <div style={{ marginBottom: "25px" }}>
          <ModalDetTransaccion
            showModal={showModal}
            setShowModal={setShowModal}
            detalle={detalle}
          ></ModalDetTransaccion>
          <ModalDetPago
            showModal={showModalPago}
            setShowModal={setShowModalPago}
            detalle={detallePago}
          ></ModalDetPago>
          <ModalDetDeuda
            showModal={showModalDeuda}
            setShowModal={setShowModalDeuda}
            detalle={detalleDeuda}
          ></ModalDetDeuda>
          <ModalDetProcuracion
            showModalProc={showModalProcuracion}
            setShowModalProc={setShowModalProcuracion}
            detalle={detalleProcuracion ?? null}
          ></ModalDetProcuracion>
          <ModalDetPlan
            showModalPlan={showModalPlan}
            setShowModalPlan={setShowModalPlan}
            detalle={detallePlan ?? null}
          ></ModalDetPlan>
          <div className="grid grid-cols-12 gap-6 mt-5" style={{ marginTop: "0px" }}>
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <h2>CUENTA CORRIENTE</h2>
              <hr style={{ display: "block" }} />
            </div>
            <div
              className="col-span-12 lg:col-span-6 2xl:col-span-6"
              style={{ textAlign: "right" }}
            >
              <Menu className="inline-block mb-2 mr-1">
                <Button
                  as={Button}
                  onClick={generatePDF}
                  style={{
                    backgroundColor: "rgb(22, 78, 99)",
                    color: "white",
                  }}
                >
                  <Lucide icon="ArrowUpRight" className="w-4 h-4 mr-2" /> Imprimir
                </Button>
                {/* <Menu.Button
                  as={Button}
                  style={{
                    backgroundColor: "rgb(22, 78, 99)",
                    color: "white",
                    marginRight: "10px",
                  }}
                >
                  <Lucide icon="ChevronsDown" className="w-4 h-4 mr-2" /> Informes
                </Menu.Button>
                <Menu.Items className="w-40">
                  <Menu.Item>
                    <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Resumen de cuenta
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Resumne Cta. Monto Orig.
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Resumen Judicial
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Resumen según decreto
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Informe de Pagos
                  </Menu.Item>
                </Menu.Items> */}
              </Menu>
              {/* <Button
                as={Button}
                style={{
                  backgroundColor: "rgb(22, 78, 99)",
                  color: "white",
                  marginRight: "10px",
                }}
              >
                <Lucide icon="Calculator" className="w-4 h-4 mr-2" /> Simulación descuentos
              </Button> */}
              <Button
                as={Button}
                style={{
                  backgroundColor: "rgb(22, 78, 99)",
                  color: "white",
                }}
                onClick={handleCancelar}
              >
                <Lucide icon="ArrowUpRight" className="w-4 h-4 mr-2" /> Salir
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3">
              <strong>Tipo de Transacción</strong>
              <FormSelect
                className="mt-2 sm:mr-2"
                aria-label="Default select example"
                onChange={handleSelectChangeTipo}
              >
                {cate_deuda.map((cate, index) => (
                  <option key={cate.value} value={cate.value}>
                    {cate.text}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3">
              <strong>Filtro</strong>
              <br />
              <FormSelect className="mt-2 sm:mr-2" onChange={handleSelectChange}>
                <option value="1">Cuenta completa</option>
                <option value="2">Solo deudas</option>
              </FormSelect>
            </div>
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3 flex flex-col">
              <strong>Saldo Original</strong>
              <FormInput
                style={{
                  marginTop: "8px",
                  fontWeight: "600",
                  color: "rgb(185, 30, 28)",
                }}
                id="regular-form-1"
                type="text"
                value={currencyFormat(saldo_original).toString()}
                disabled
              />
            </div>
            <div className="col-span-12 lg:col-span-3 2xl:col-span-3">
              <strong>Saldo Actualizado</strong>
              <FormInput
                style={{
                  marginTop: "8px",
                  fontWeight: "600",
                  color: "rgb(185, 30, 28)",
                }}
                id="regular-form-1"
                type="text"
                value={currencyFormat(saldo_actualizado).toString()}
                disabled
              />
            </div>
          </div>
        </div>
        <div
          ref={divRef}
          className="containerctacte box"
          style={{
            backgroundColor: "white",
            paddingTop: "0px",
            height: "400px",
            overflowY: "scroll",
          }}
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-12 2xl:col-span-12">
              <hr />
              <Table style={{ backgroundColor: "white" }}>
                <Table.Thead
                  style={{
                    zIndex: "1",
                    position: "sticky",
                    top: "0",
                    color: "white",
                    backgroundColor: "rgb(22 78 99)",
                  }}
                >
                  <Table.Tr>
                    <Table.Th>Movimiento</Table.Th>
                    <Table.Th>Periodo</Table.Th>
                    <Table.Th>Monto Orig.</Table.Th>
                    <Table.Th>Debe</Table.Th>
                    <Table.Th>Haber</Table.Th>
                    <Table.Th>Sub-Total</Table.Th>
                    <Table.Th>Procuración</Table.Th>
                    <Table.Th>Plan Pago</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody style={{ zIndex: "0" }}>
                  {autos.map((auto, index) => (
                    <Table.Tr key={index}>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                        className={classNames({
                          "text-success": auto.des_movimiento == "Pago",
                          "text-danger": auto.des_movimiento == "Deuda",
                        })}
                      >
                        {auto.des_movimiento}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                      >
                        {auto.periodo}
                      </Table.Td>
                      <Table.Td
                        style={{
                          textAlign: "right",
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                      >
                        {currencyFormat(auto.monto_original)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          textAlign: "right",
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                          color: "#B91E1C",
                        }}
                      >
                        {currencyFormat(auto.debe)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          textAlign: "right",
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                          color: "#0D9488",
                        }}
                      >
                        {currencyFormat(auto.haber)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          textAlign: "right",
                          border: "none",
                        }}
                        className={classNames({
                          "text-success": auto.sub_total >= 0,
                          "text-danger": auto.sub_total < 0,
                        })}
                      >
                        {currencyFormat(auto.sub_total)}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                      >
                        {auto.nro_procuracion > 0 ? auto.nro_procuracion : "---"}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                        }}
                      >
                        {auto.nro_plan > 0 ? auto.nro_plan : "---"}
                      </Table.Td>
                      <Table.Td
                        style={{
                          paddingTop: "4px",
                          paddingBottom: "0px",
                          fontSize: "13px",
                          border: "none",
                          textAlign: "right",
                        }}
                      >
                        <Menu>
                          <Menu.Button
                            as={Button}
                            style={{
                              backgroundColor: auto.sub_total >= 0 ? "#0D9488" : "#c0504e",
                              color: "white",
                              marginRight: "10px",
                              height: "25px",
                            }}
                          >
                            ...
                          </Menu.Button>
                          <Menu.Items className="w-48" placement="left">
                            <Menu.Item>
                              <Button
                                style={{
                                  textAlign: "left",
                                  border: "None",
                                  padding: "5px",
                                  paddingLeft: "0",
                                  fontWeight: "700",
                                }}
                                onClick={() =>
                                  handledet(auto.tipo_transaccion, auto.nro_transaccion)
                                }
                              >
                                <Lucide icon="FileSearch" className="w-4 h-4 mr-2" />
                                Detalle Transaccion
                              </Button>
                            </Menu.Item>
                            {auto.des_movimiento == "Deuda" && (
                              <Menu.Item>
                                <Button
                                  style={{
                                    textAlign: "left",
                                    border: "None",
                                    padding: "5px",
                                    paddingLeft: "0",
                                    fontWeight: "700",
                                  }}
                                  onClick={() => handledetDeuda(auto.nro_transaccion)}
                                >
                                  <Lucide icon="FileSearch" className="w-4 h-4 mr-2" />
                                  Detalle Deuda
                                </Button>
                              </Menu.Item>
                            )}
                            {(auto.des_movimiento == "Pago" ||
                              auto.des_movimiento == "Fin de Plan") && (
                                <Menu.Item>
                                  <Button
                                    style={{
                                      textAlign: "left",
                                      border: "None",
                                      padding: "5px",
                                      paddingLeft: "0",
                                      fontWeight: "700",
                                    }}
                                    onClick={() =>
                                      handledetPago(auto.nro_cedulon, auto.nro_transaccion)
                                    }
                                  >
                                    <Lucide icon="FileSearch" className="w-4 h-4 mr-2" />
                                    Detalle de Pago
                                  </Button>
                                </Menu.Item>
                              )}
                            {auto.nro_procuracion != 0 && (
                              <Menu.Item>
                                <Button
                                  style={{
                                    textAlign: "left",
                                    border: "None",
                                    padding: "5px",
                                    paddingLeft: "0",
                                    fontWeight: "700",
                                  }}
                                  onClick={() => handledetProcuracion(auto.nro_procuracion)}
                                >
                                  <Lucide icon="FileSearch" className="w-4 h-4 mr-2" />
                                  Detalle Procuración
                                </Button>
                              </Menu.Item>
                            )}
                            {auto.nro_plan != 0 && (
                              <Menu.Item>
                                <Button
                                  style={{
                                    textAlign: "left",
                                    border: "None",
                                    padding: "5px",
                                    paddingLeft: "0",
                                    fontWeight: "700",
                                  }}
                                  onClick={() => handledetPlan(auto.nro_plan)}
                                >
                                  <Lucide icon="FileSearch" className="w-4 h-4 mr-2" />
                                  Detalle Plan de Pagos
                                </Button>
                              </Menu.Item>
                            )}
                          </Menu.Items>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CuentaCorriente
