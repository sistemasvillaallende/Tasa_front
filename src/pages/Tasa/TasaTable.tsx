import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import { useTasaContext } from '../../context/TasaProvider';
import { useNavigate } from 'react-router-dom';
import Lucide from "../../base-components/Lucide"
import { getSituacion } from "./../../utils/tasaUtils"

type Dato = {
  cuil: string;
  ultimo_periodo: string;
  circunscripcion: number;
  seccion: number;
  manzana: number;
  parcela: number;
  p_h: number;
  saldo_adeudado: number;
  nom_barrio_dom_esp: string;
  nom_calle_dom_esp: string;
  nro_dom_esp: number;
  cod_estado: number;
  nombre: string;
  cod_situacion_judicial: number;
  con_deuda: number;
};

const TasaTable = () => {
  const [datos, setDatos] = useState<Dato[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const { setSelectedInmueble, setInmuebles } = useTasaContext();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_BASE}Inmuebles/readTable`)
      .then((res) => {
        setDatos(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener los datos", err);
      });
  }, []);

  const columnas: TableColumn<Dato>[] = [
    {
      name: "Propietario",
      selector: (row) => row.nombre, sortable: true,
      minWidth: "200px"
    },
    {
      name: "Inmueble",
      selector: (row) => `${row.nom_calle_dom_esp} ${row.nro_dom_esp}, ${row.nom_barrio_dom_esp}`,
      sortable: true,
      minWidth: "300px",
    },
    {
      name: "Nomenclatura",
      cell: (row) => <span>C{row.circunscripcion}-S{row.seccion}-M{row.manzana}-P{row.parcela}-Ph{row.p_h}</span>,
      minWidth: "150px",
    },
    {
      name: "Estado",
      selector: (row) => (row.cod_estado === 0 ? "Activo" : "Inactivo"),
    },
    {
      name: "Último período",
      selector: (row) => row.ultimo_periodo,
      sortable: true,
    },
    {
      name: "Situación Judicial",
      selector: (row) => getSituacion(row.cod_situacion_judicial),
    },
    {
      name: "Saldo adeudado",
      selector: (row) => `$ ${row.saldo_adeudado.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Multas",
      cell: (row) => `${conMulta(row.con_deuda)}`,
    },
    {
      name: "",
      cell: (row) => <button className="p-2 bg-sky-200 rounded hover:bg-sky-400" onClick={() => handleRowClick(row)}> <Lucide icon="Eye" className="w-5 h-5" /></button>,
    },
  ];

  const conMulta = (deuda: number) => {
    return deuda === 1 ? "Si" : "No"
  }

  const datosFiltrados = datos.filter((item) => {
    const nomenclatura = `C${item.circunscripcion}-S${item.seccion}-M${item.manzana}-P${item.parcela}-Ph${item.p_h}`;
    const inmueble = `${item.nom_calle_dom_esp} ${item.nro_dom_esp}, ${item.nom_barrio_dom_esp}`;
    const estado = item.cod_estado === 0 ? "Activo" : "Inactivo";
    const situacion = getSituacion(item.cod_situacion_judicial);

    const texto = `
    ${item.cuil}
    ${item.ultimo_periodo}
    ${item.nombre}
    ${item.saldo_adeudado}
    ${inmueble}
    ${estado}
    ${situacion}
    ${nomenclatura}
  `.toLowerCase();

    return texto.includes(filtro.toLowerCase());
  });


  const handleRowClick = (row: Dato) => {
    setSelectedInmueble(row);
    setInmuebles([row]);
    navigate(`/detalle/${row.circunscripcion}/${row.seccion}/${row.manzana}/${row.parcela}/${row.p_h}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white p-5">
      <input
        type="text"
        placeholder="Buscar..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-1/3"
      />
      <DataTable
        columns={columnas}
        data={datosFiltrados}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default TasaTable;
