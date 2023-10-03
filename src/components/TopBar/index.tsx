import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Lucide from "../../base-components/Lucide"
import logoUrl from "../../assets/logo.png"
import Breadcrumb from "../../base-components/Breadcrumb"
import { Menu, Popover } from "../../base-components/Headless"
import fakerData from "../../utils/faker"
import _ from "lodash"
import clsx from "clsx"
import { useUserContext } from "../../context/UserProvider"
import avatarUser from "../../assets/avatarUser.svg"
import TituloTopBar from "./TituloTopBar"

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const [searchDropdown, setSearchDropdown] = useState(false)
  const showSearchDropdown = () => {
    setSearchDropdown(true)
  }
  const hideSearchDropdown = () => {
    setSearchDropdown(false)
  }

  const { handleLogout, user, setUser } = useUserContext()

  useEffect(() => {
    const usuarioLogeado = sessionStorage.getItem("usuarioLogeado")
    if (usuarioLogeado) {
      setUser(JSON.parse(usuarioLogeado))
    }
  }, [])

  return (
    <>
      <div className="new_topbar" style={{ height: "90px" }}>
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
            <Menu
              className="menu_topbar h-full cursor-pointer flex align-center w-100 h-100 intro-x"
              style={{ justifyContent: "right", backgroundColor: "inherit" }}
            >
              <Menu.Button className="elementTopbar w-full">
                <img alt="Usuario" src={avatarUser} />
                <h3>{user ? `${user.userName}` : `cargando...`}</h3>
              </Menu.Button>
              <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                <Menu.Item className="hover:bg-white/5" onClick={handleLogout}>
                  <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Salir
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
