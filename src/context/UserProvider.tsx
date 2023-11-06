import { useState, useContext, createContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import menuIcon from "../assets/IconoMenu.svg"
import { capitalizeFirstLetter } from "../utils/helper"
import { setSecureItem } from "../modules/secureStorage"

type UserType = {
  nombre: string
  apellido: string
  email: string
  userName: string
  cuit: string | null
  nombre_oficina: string
  cod_oficina: number
  cod_usuario: string
  administrador: boolean
  img?: string
  token: string
} | null

type MenuItem = {
  texto: string
  url: string
  icono: string
  submenu: any
}

type UserContextType = {
  user: UserType
  error: string | null
  menuItems: MenuItem[]
  menuIcon: string
  setUser: (user: UserType) => void
  handleLogin: (username: string, password: string) => void
  handleLogout: () => void
}

const userContext = createContext<UserContextType>({
  user: null,
  error: null,
  menuItems: [],
  menuIcon: "",
  setUser: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
})

export function useUserContext() {
  return useContext(userContext)
}

export function UserProvider({ children }: any) {
  const [user, setUser] = useState<UserType>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const menuItems: MenuItem[] = [
    { texto: "Inicio", url: "/", icono: "ArrowRightCircle" },
    { texto: "Editar", url: "/editar", icono: "Edit" },
    { texto: "Inicia Cta. Corriente", url: "/iniciar", icono: "FilePlus" },
    {
      texto: "Cta. Corriente",
      url: "/iniciar",
      icono: "DollarSign",
      submenu: [{ texto: "Cta. Corriente", url: "/iniciar", icono: "DollarSign" }],
    },
    { texto: "Cancelar Cta.Cte.", url: "/editar", icono: "ThumbsUp" },
    { texto: "Eliminar Cancelación", url: "/editar", icono: "Slash" },
    { texto: "Cedulones", url: "/editar", icono: "FileText" },
    { texto: "ReLiquida", url: "/editar", icono: "Rewind" },
  ]

  const handleLogin = async (username: any, password: any) => {
    setError(null)
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_USER}/Login/ValidaUsuarioConOficina`,
        {
          params: {
            user: username,
            password: password,
          },
        }
      )

      if (response?.statusText === "OK") {
        const userData = response?.data
        const token = "token generado por react"
        setUser({
          nombre: capitalizeFirstLetter(userData?.nombre_completo?.split(" ")[0]) ?? "",
          apellido: capitalizeFirstLetter(userData?.nombre_completo?.split(" ")[1]) ?? "",
          email: userData?.email,
          userName: userData?.nombre,
          cuit: userData?.cuit,
          administrador: userData?.administrador,
          cod_oficina: userData?.cod_oficina,
          cod_usuario: userData?.cod_usuario,
          nombre_oficina: userData?.nombre_oficina,
          token: token,
        })
      } else {
        setError("Usuario o contraseña incorrectos")
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error)
      setError("Usuario o contraseña incorrectos")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogeado")
    setUser(null)
    navigate("/")
  }

  useEffect(() => {
    if (user) {
      setSecureItem("usuarioLogeado", user)
      navigate("/")
    }
  }, [user])

  return (
    <userContext.Provider
      value={{ user, error, menuItems, menuIcon, setUser, handleLogin, handleLogout }}
    >
      {children}
    </userContext.Provider>
  )
}
