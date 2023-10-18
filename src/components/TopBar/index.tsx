import { useEffect } from "react"
import { Link } from "react-router-dom"
import Lucide from "../../base-components/Lucide"
import logoUrl from "../../assets/logo.png"
import { Menu } from "../../base-components/Headless"
import { useUserContext } from "../../context/UserProvider"
import TituloTopBar from "./TituloTopBar"
import { getSecureItem } from "../../modules/secureStorage"
import { capitalizeFirstLetter } from "../../utils/helper"

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const { handleLogout, user, setUser } = useUserContext()

  useEffect(() => {
    const usuarioLogeado = localStorage.getItem("usuarioLogeado")
    if (usuarioLogeado) {
      const parsedUser = getSecureItem("isLoggedIn")
      if (parsedUser) {
        setUser(parsedUser)
      }
    }
  }, [])
  return (
    <>
      <div className="z-50 new_topbar" style={{ height: "90px" }}>
        <div
          className="flex justify-between items-center pl-10"
          style={{
            boxShadow: "0px 7px 5px -2px rgba(73,73,73,0.75)",
            height: "90px",
          }}
        >
          {/* BEGIN: Logo */}
          <div
            className="flex items-center"
            style={{
              height: "90px",
              width: "240px",
            }}
          >
            <Link to="/" className="logo_topbar">
              <img alt="Logo" src={logoUrl} style={{ height: "50px", width: "auto" }} />
            </Link>
          </div>
          {/* END: Logo */}

          <div
            className=""
            style={{
              height: "90px",
              textAlign: "center",
            }}
          >
            <TituloTopBar />
          </div>

          {/* BEGIN: Account Menu */}
          <div className="flex justify-around items-center md:w-[290px] md:h-[69px] lg:w-[352px]  bg-secondary rounded-l-[20px]">
            <Menu>
              <Menu.Button className="flex align-center w-100 h-100 intro-x">
                {user?.img && (
                  <img
                    className="block w-12 h-12 lg:w-14 lg:h-14 image-fit object-cover  shadow-lg zoom-in rounded-full"
                    alt="Perfil de Usuario"
                    src={user.img}
                  />
                )}
                <h3 className="text-white text-center self-center mr-5 ml-3 text-xl font-bold">
                  {user ? `${user.nombre} ${user.apellido}` : `cargando...`}
                </h3>
              </Menu.Button>
              <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                <Menu.Header className="font-normal">
                  <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                    {user && capitalizeFirstLetter(user.userName)}
                  </div>
                </Menu.Header>
                <Menu.Divider className="bg-white/[0.08]" />
                <Menu.Item className="hover:bg-white/5" onClick={handleLogout}>
                  <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Cerrar Sesión
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
          {/* END: Account Menu */}
        </div>
      </div>
    </>
  )
}

export default Main
