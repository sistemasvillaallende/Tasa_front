import Lucide from "../../base-components/Lucide";
import imagenComercio from "../../assets/IconoComercio.svg";
import { Link } from "react-router-dom";
import { useTasaContext } from "../../context/TasaProvider";
import '../../assets/css/components/_Sidebar.css';
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { HomeIcon } from "@radix-ui/react-icons";

const MenuElemento = () => {
  const { inmuebles, selectedInmueble } = useTasaContext();
  const navigate = useNavigate();
  const { id } = useParams()

  const updatedMenu: any = [
    {
      icon: "ArrowLeftCircle",
      pathname: "/",
      title: "Inicio",
    },
    {
      icon: "Eye",
      pathname: `/detalle/${id ?? ""}`,
      title: "Detalle",
    },
    {
      icon: "Edit",
      pathname: `/editar/${id ?? ""}`,
      title: "Editar",
    },
    {
      icon: "FilePlus",
      pathname: `/iniciarctacte/${id ?? ""}`,
      title: "Inicia Cta. Corriente",
    },
    {
      icon: "DollarSign",
      pathname: `/cuenta-corriente/${id ?? ""}`,
      title: "Cta. Corriente",
    },
    {
      icon: "ThumbsUp",
      pathname: `/cancelar-cuenta/${id ?? ""}`,
      title: "Cancelar Cta.Cte.",
    },
    {
      icon: "Slash",
      pathname: `/eliminar-cancelacion/${id ?? ""}`,
      title: "Eliminar Cancelación",
    },
    {
      icon: "FileText",
      pathname: `/cedulones/${id ?? ""}`,
      title: "Cedulones",
    },
    {
      icon: "Rewind",
      pathname: `/reliquida/${id ?? ""}`,
      title: "ReLiquida",
    },
    {
      icon: "Save",
      pathname: `/informes/${id ?? ""}`,
      title: "Informes",
    },
    {
      icon: "FileText",
      pathname: `/deudas/${id ?? ""}`,
      title: "Deudas",
    },
    {
      title: 'Domicilio Postal',
      pathname: `/domiciliopostal/${id ?? ""}`,
      icon: "FileText",
    },
    {
      icon: "Droplet",
      pathname: `/conexionagua/${id ?? ""}`,
      title: "Conexión de Agua",
    },
    {
      icon: "FileText",
      pathname: `/baldio/${id ?? ""}`,
      title: "Nota de Baldío",
    },
    {
      icon: "FileText",
      pathname: `/conceptos/${id ?? ""}`,
      title: "Conceptos",
    },
    {
      icon: "FileText",
      pathname: `/frente/${id ?? ""}`,
      title: "Frente",
    },
  ]

  const formatearPropiedad = (inmueble: any) => {
    if (!inmueble) return '';
    const { circunscripcion, seccion, manzana, parcela, p_h } = inmueble;
    return `C:${circunscripcion} S:${seccion} M:${manzana} P:${parcela} PH:${p_h}`;
  }

  const inmuebleActual = selectedInmueble || (inmuebles && inmuebles[0]);

  if (inmuebleActual) {
    return (
      <>
        <nav className="sidebar">
          <h2>
            <Lucide icon="Home" className="w-4 h-4 mr-2" style={{
              height: '40px', width: '40px',
              color: 'hsla(0, 0%, 13%, 1)'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '0px' }}>
              <span style={{ paddingTop: '5px' }}>Tasa de la Propiedad</span>
              <span style={{
                fontSize: '0.9em',
                color: 'hsla(0, 0%, 40%, 1)',
                paddingTop: '3px'
              }}>
                {formatearPropiedad(inmuebleActual)}
              </span>
            </div>
          </h2>
          <ul>
            {updatedMenu.map((item: any, index: number) => (
              <li key={index}>
                <Link to={item.pathname}>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </>
    );
  }
};

export default MenuElemento;
