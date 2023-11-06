import React, { useEffect } from "react"

import axios from "axios"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import _ from "lodash"

import { InformeCompleto, CategoriasDeudaTasa } from "../../interfaces/Inmueble"

import { currencyFormat } from "../../utils/helper"

import Table from "../../base-components/Table"
import Button from "../../base-components/Button"
import { FormInput, FormLabel, FormInline, FormSelect } from "../../base-components/Form"
import Lucide from "../../base-components/Lucide"
import Cargando from "../../components/Cargando"

import { useTasaContext } from "../../context/TasaProvider"

const InformeDeDeuda = () => {
  const [informeCompleto, setInformeCompleto] = React.useState<InformeCompleto[]>([])
  const [periodo, setPeriodo] = React.useState<string>("")
  const { getInmueble } = useTasaContext()
  const [mostrarTabla, setMostrarTabla] = React.useState<boolean>(false)
  const [cargando, setCargando] = React.useState<boolean>(false)
  const [categoriasDeudaTasa, setCategoriasDeudaTasa] = React.useState<CategoriasDeudaTasa[]>([])
  const [categoriaDeuda, setCategoriaDeuda] = React.useState<any>()
  const [tipoDeInforme, setTipoDeInforme] = React.useState<string>("1")

  const [btnImprimir, setBtnImprimir] = React.useState<boolean>(false)

  const detalleInmueble = getInmueble()
  const { circunscripcion, seccion, manzana, p_h, parcela } = detalleInmueble ?? {
    circunscripcion: 0,
    parcela: 0,
    seccion: 0,
    manzana: 0,
    p_h: 0,
  }
  useEffect(() => {
    conseguirListaCategoriasDeudaTasa()
  }, [])

  const handleAuditoria = async () => {
    if (periodo === "") {
      Swal.fire({
        title: "Error",
        text: "Debes ingresar un periodo para continuar.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
      return
    }
    if (validarFormatoPeriodo(periodo) === false) {
      Swal.fire({
        title: "Error",
        text: "Debes ingresar un periodo con el formato AAAA/MM para continuar.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
      return
    }
    const { value } = await Swal.fire({
      title: "Autorización",
      input: "textarea",
      inputPlaceholder: "Observaciones",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#27a3cf",
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar un texto para continuar"
        }
      },
    })

    if (value) {
      handleInformeCompleto(
        circunscripcion,
        seccion,
        manzana,
        p_h,
        parcela,
        periodo,
        categoriaDeuda,
        value
      )
    }
  }

  const handleInformeCompleto = async (
    circunscripcion: number,
    seccion: number,
    manzana: number,
    p_h: number,
    parcela: number,
    periodo: string,
    categoriaDeuda: string,
    observaciones: string
  ) => {
    try {
      setCargando(true)
      const bodyConsulta = {
        id_auditoria: 0,
        fecha: "string",
        usuario: "string",
        proceso: "string",
        identificacion: "string",
        autorizaciones: "string",
        observaciones: observaciones,
        detalle: "string",
        ip: "string",
      }

      let deudaDesde = categoriaDeuda
      let deudaHasta = categoriaDeuda

      if (tipoDeInforme) {
        deudaDesde = "1"
        deudaHasta = "50"
      }

      if (tipoDeInforme === "1") {
        deudaDesde = "1"
        deudaHasta = "50"
      }

      if (tipoDeInforme === "2") {
        deudaDesde = categoriaDeuda
        deudaHasta = categoriaDeuda
      }

      if (categoriaDeuda === "0") {
        deudaDesde = "1"
        deudaHasta = "50"
      }

      const URL = `${
        import.meta.env.VITE_URL_TASA
      }Resumendeuda?cir=${circunscripcion}&sec=${seccion}&man=${manzana}&par=${parcela}&p_h=${p_h}&tipo_consulta=${tipoDeInforme}&periodo=${periodo}&cate_deuda_desde=${deudaDesde}&cate_deuda_hasta=${deudaHasta}`

      const response = await axios.post(URL, bodyConsulta)
      setInformeCompleto(response.data)
      setMostrarTabla(true)
      setCargando(false)
      setBtnImprimir(true)
      if (response.data === "") {
        Swal.fire({
          title: "Error",
          text: "Al parecer no hay datos para mostrar, por favor intente con otros parámetros.",
          icon: "warning",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#27a3cf",
        })
      }
      setMostrarTabla(true)
      setCargando(false)
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Al parecer hay un error al cargar los datos, por favor intente nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#27a3cf",
      })
      setCargando(false)
    }
  }

  const validarFormatoPeriodo = (periodo: string) => {
    const formatoRegex = /^\d{4}\/\d{2}$/
    if (formatoRegex.test(periodo)) {
      return true
    } else {
      return false
    }
  }

  const conseguirListaCategoriasDeudaTasa = async () => {
    try {
      const URL = `${import.meta.env.VITE_URL_TASA}ListarCategoriasTasa`
      const response = await axios.get(URL)
      setCategoriasDeudaTasa(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleImprimir = () => {
    const doc = new jsPDF()
    doc.setFontSize(8)
    doc.text(`INFORME COMPLETO`, 15, 10)
    const fecha = new Date()
    const fechaActual = fecha.toLocaleDateString()
    // doc.text(`DOMINIO: ${dominioSinEspacios}`, 15, 15)
    // doc.text(`CONTRIBUYENTE: ${vehiculo?.nombre}`, 15, 20)

    const columns = [
      "#",
      "Concepto",
      "Categoria",
      "Periodo",
      "Debe",
      "Haber",
      "Plan de Pago",
      "Nro. Proc.",
    ]
    const body = informeCompleto.map((item, index) => [
      index + 1,
      item.des_transaccion,
      item.categoria,
      item.periodo,
      currencyFormat(item.debe),
      currencyFormat(item.haber),
      item.nro_plan,
      item.nro_procuracion,
    ])

    //totales
    const debe = _.sumBy(informeCompleto, "debe")
    const haber = _.sumBy(informeCompleto, "haber")
    const totalDebe = currencyFormat(debe)
    const totalHaber = currencyFormat(haber)
    const total = debe - haber
    const totalGeneral = currencyFormat(total)

    body.push(["", "", "", "TOTALES:", totalDebe, totalHaber, "", ""])
    body.push(["", "", "", "", "", "", "TOTAL GENERAL:", totalGeneral])

    autoTable(doc, {
      startY: 25,
      head: [columns],
      body: body,
    })

    doc.save(`informe_de_deuda_${detalleInmueble?.cuil}_${fechaActual}.pdf`)
  }

  return (
    <>
      <div className="flex flex-col items-center mt-4">
        <FormInline>
          <FormLabel htmlFor="horizontal-form-1" className="sm:w-20">
            Periodo
          </FormLabel>
          <FormInput
            id="horizontal-form-1"
            type="text"
            placeholder="AAAA/MM"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />

          <FormLabel htmlFor="horizontal-form-1" className="sm:w-10">
            Tipo
          </FormLabel>
          <FormSelect
            className="sm:mr-1"
            aria-label="Default select example"
            value={tipoDeInforme}
            onChange={(e) => setTipoDeInforme(e.target.value)}
          >
            <option value="1">Todos</option>
            <option value="2">Deudas</option>
          </FormSelect>

          {tipoDeInforme === "2" && (
            <>
              <FormLabel htmlFor="horizontal-form-1" className="sm:w-20">
                Categoria
              </FormLabel>
              <FormSelect
                className="sm:mr-2"
                aria-label="Default select example"
                value={categoriaDeuda}
                onChange={(e) => setCategoriaDeuda(e.target.value)}
              >
                <option>seleccionar categoria</option>
                {Array.isArray(categoriasDeudaTasa) &&
                  categoriasDeudaTasa.map((tipo: any) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.text}
                    </option>
                  ))}
              </FormSelect>
            </>
          )}

          <Button variant="primary" className="ml-3" onClick={handleAuditoria}>
            <Lucide icon="Filter" className="w-4 h-4 mr-1" />
            Filtrar
          </Button>
          {btnImprimir && (
            <Button variant="soft-warning" className="ml-3" onClick={handleImprimir}>
              <Lucide icon="DownloadCloud" className="w-4 h-4 mr-1" />
              PDF
            </Button>
          )}
        </FormInline>
      </div>

      <div className="overflow-x-auto mt-3">
        {cargando && <Cargando mensaje="cargando" />}
        {mostrarTabla && (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  #
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Concepto
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Categoria
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Periodo
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-right">
                  Debe
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-right">
                  Haber
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Plan de Pago
                </Table.Th>
                <Table.Th className="whitespace-nowrap border-b-0 whitespace-nowrap text-center">
                  Nro. Proc.
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {informeCompleto.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {index + 1}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.des_transaccion}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.categoria}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.periodo}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-right">
                    {currencyFormat(item.debe)}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-right">
                    {currencyFormat(item.haber)}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.nro_plan}
                  </Table.Td>
                  <Table.Td className="border-b-0 whitespace-nowrap text-center">
                    {item.nro_procuracion}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </div>
    </>
  )
}

export default InformeDeDeuda
