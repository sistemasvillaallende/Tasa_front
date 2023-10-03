import { useState, useContext, createContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import menuIcon from "../assets/IconoMenu.svg"

type UserType = {
  userName: string
  token: string
  nombre: string
  apellido: string
} | null

type MenuItem = {
  texto: string
  url: string
  icono: string
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
  const navigate = useNavigate()

  const menuItems: MenuItem[] = [
    { texto: "Inicio", url: "/", icono: "ArrowRightCircle" },
    { texto: "Editar", url: "/editar", icono: "Box" },
  ]

  const handleLogin = async (username: any, password: any) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_BASE}/Login/ValidaUsuario`, {
        params: {
          user: username,
          password: password,
        },
      })

      if (response.data) {
        const token = "token generado por react"
        setUser({
          userName: username,
          token: token,
          nombre: "Nombre de usuario",
          apellido: "Apellido de usuario",
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
    sessionStorage.removeItem("usuarioLogeado")
    navigate("/")
  }

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("usuarioLogeado", JSON.stringify(user))
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
