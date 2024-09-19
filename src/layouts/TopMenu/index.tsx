import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { selectTopMenu } from "../../stores/topMenuSlice"
import { useAppSelector } from "../../stores/hooks"
import _ from "lodash"
import { FormattedMenu, linkTo, nestedMenu } from "./top-menu"
import SideMenu from "../../layouts/SideMenu"
import Lucide from "../../base-components/Lucide"
import clsx from "clsx"
import TopBar from "../../components/TopBar"
import MobileMenu from "../../components/MobileMenu"
import MenuElemento from "../MenuElemento/MenuElemento";


function Main() {
  const location = useLocation()
  const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu>>([])
  const topMenuStore = useAppSelector(selectTopMenu)
  const topMenu = () => nestedMenu(topMenuStore, location)
  const [showLista, setShowLista] = useState(false)
  const [showEdicion, setShowEdicion] = useState(false)

  useEffect(() => {
    setFormattedMenu(topMenu())
    if (location.pathname == "/" || location.pathname == "/nuevaTasa" || paginacion()) {
      setShowLista(true)
      setShowEdicion(false)
    } else {
      setShowLista(false)
      setShowEdicion(true)
    }
  }, [topMenuStore, location.pathname])

  const paginacion = () => {
    return location.pathname.includes("autos")
  }

  const nuevaTasa = () => {
    return location.pathname.includes("nuevaTasa")
  }

  return (
    <div className="principal">
      <div className="py-5 md:py-0 h-full">
        <MobileMenu />
        {showLista && (
          <>
            <Outlet />
          </>
        )}
        {showEdicion && (
          <div className="grid grid-cols-12 grilla">
            <div
              className="col-span-2 intro-y"
              style={{
                backgroundColor: "white",
                overflow: "hidden",
                borderRadius: "0px",
                paddingRight: "20px",
                boxShadow: "4px 4px 8px 0 rgba(0, 0, 0, 0.2)",
              }}
            >
              <MenuElemento />
              <SideMenu />
            </div>
            <div
              className="conScroll intro-y col-span-10 box">
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MenuLink(props: {
  className?: string
  menu: FormattedMenu
  level: "first" | "second" | "third"
}) {
  const navigate = useNavigate()
  return (
    <a
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[55px] flex items-center px-5 mr-1 text-slate-600 relative rounded-full xl:rounded-xl",
        {
          "mt-[3px]": props.level == "first",
          "bg-slate-100 text-primary dark:bg-darkmode-700":
            props.level == "first" && props.menu.active,
          "before:content-[''] before:hidden xl:before:block before:inset-0 before:rounded-xl before:absolute before:border-b-[3px] before:border-solid before:border-black/[0.08] dark:before:border-black/[0.08] before:dark:bg-darkmode-700":
            props.level == "first" && props.menu.active,
          "after:content-[''] after:w-[20px] after:h-[80px] after:bg-menu-active after:bg-no-repeat after:bg-cover after:absolute after:left-0 after:right-0 after:bottom-0 after:mx-auto after:transform after:rotate-90 after:hidden xl:after:block after:dark:bg-menu-active-dark":
            props.level == "first" && props.menu.active,
          "px-0 mr-0": props.level != "first",

          // Animation
          "after:opacity-0 after:-mb-[74px] after:animate-[0.3s_ease-in-out_1s_active-top-menu-chevron] after:animate-fill-mode-forwards":
            props.level == "first" && props.menu.active,
        },
        props.className,
      ])}
      onClick={(event) => {
        event.preventDefault()
        linkTo(props.menu, navigate)
      }}
    >
      <div
        className={clsx([
          "z-10 dark:text-slate-400",
          props.level == "first" && "-mt-[3px]",
          props.level == "first" &&
          props.menu.active &&
          "dark:text-white text-primary xl:text-primary",
        ])}
      >
        <Lucide icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          "ml-3 flex items-center whitespace-nowrap z-10 dark:text-slate-400",
          props.level == "first" && "-mt-[3px]",
          props.level == "first" &&
          props.menu.active &&
          "font-medium dark:text-white text-slate-800 xl:text-primary",
          props.level != "first" && "w-full",
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <Lucide
            icon="ChevronDown"
            className={clsx([
              "hidden transition ease-in duration-100 w-4 h-4 xl:block",
              props.level == "first" && "ml-2",
              props.level != "first" && "ml-auto",
            ])}
          />
        )}
      </div>
    </a>
  )
}

export default Main
