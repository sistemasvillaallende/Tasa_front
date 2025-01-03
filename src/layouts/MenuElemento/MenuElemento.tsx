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
  const { id, circunscripcion, seccion, manzana, parcela, p_h } = useParams();

  const getUrlWithNomenclatura = (baseUrl: string) => {
    if (id) {
      const inmueble = selectedInmueble || (inmuebles && inmuebles[0]);
      if (inmueble) {
        return `${baseUrl}/${inmueble.circunscripcion}/${inmueble.seccion}/${inmueble.manzana}/${inmueble.parcela}/${inmueble.p_h}`;
      }
    }
    if (circunscripcion) {
      return `${baseUrl}/${circunscripcion}/${seccion}/${manzana}/${parcela}/${p_h}`;
    }
    return "/";
  };

  const updatedMenu: any = [
    {
      icon: "ArrowLeftCircle",
      pathname: "/",
      title: "Inicio",
    },
    {
      icon: "Eye",
      pathname: getUrlWithNomenclatura("/detalle"),
      title: "Detalle",
    },
    {
      icon: "Edit",
      pathname: getUrlWithNomenclatura("/editar"),
      title: "Editar",
    },
    {
      icon: "FilePlus",
      pathname: getUrlWithNomenclatura("/iniciarctacte"),
      title: "Inicia Cta. Corriente",
    },
    {
      icon: "DollarSign",
      pathname: getUrlWithNomenclatura("/cuenta-corriente"),
      title: "Cta. Corriente",
    },
    {
      icon: "ThumbsUp",
      pathname: getUrlWithNomenclatura("/cancelar-cuenta"),
      title: "Cancelar Cta.Cte.",
    },
    {
      icon: "Slash",
      pathname: getUrlWithNomenclatura("/eliminar-cancelacion"),
      title: "Eliminar Cancelación",
    },
    {
      icon: "FileText",
      pathname: getUrlWithNomenclatura("/cedulones"),
      title: "Cedulones",
    },
    {
      icon: "Rewind",
      pathname: getUrlWithNomenclatura("/reliquida"),
      title: "ReLiquida",
    },
    {
      icon: "Save",
      pathname: getUrlWithNomenclatura("/informes"),
      title: "Informes",
    },
    {
      icon: "FileText",
      pathname: getUrlWithNomenclatura("/deudas"),
      title: "Deudas",
    },
    {
      title: 'Domicilio Postal',
      pathname: getUrlWithNomenclatura("/domiciliopostal"),
      icon: "FileText",
    },
    {
      icon: "Droplet",
      pathname: getUrlWithNomenclatura("/conexionagua"),
      title: "Conexión de Agua",
    },
    {
      icon: "FileText",
      pathname: getUrlWithNomenclatura("/baldio"),
      title: "Nota de Baldío",
    },
    {
      icon: "FileText",
      pathname: getUrlWithNomenclatura("/conceptos"),
      title: "Conceptos",
    },
    {
      icon: "FileText",
      pathname: getUrlWithNomenclatura("/frente"),
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
