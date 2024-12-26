import Lucide from "../../base-components/Lucide";
import imagenComercio from "../../assets/IconoComercio.svg";
import { Link } from "react-router-dom";
import { useTasaContext } from "../../context/TasaProvider";
import '../../assets/css/components/_Sidebar.css';
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

const MenuElemento = () => {
  const { inmuebles } = useTasaContext();
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
  ]

  if (inmuebles) {
    return (
      <>
        <nav className="sidebar">
          <h2><Lucide icon="Home" className="w-4 h-4 mr-2" style={{
            height: '40px', width: '40px',
            color: 'hsla(0, 0%, 13%, 1)'
          }} />
            <span style={{ paddingTop: '10px', paddingLeft: '0px' }}>Tasa de la Propiedad</span> </h2>
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
