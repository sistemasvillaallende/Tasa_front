import React, { useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
//Paginas
import Login from "../pages/Users/Login"
import NotFound from "../pages/Errors/NotFound "
import Tasas from "../pages/Tasa/Tasas"
import TasaDetalle from "../pages/Tasa/TasaDetalle"
import TasaEditar from "../pages/Tasa/TasaEditar"
import NuevaTasa from "../pages/Tasa/NuevoLegajo/NuevaTasa"
import CedulonAuto from "../pages/Tasa/Cedulones/CedulonAuto"
//layouts
import TopMenu from "../layouts/TopMenu"
//Context
import { UserProvider } from "../context/UserProvider"
import { TasaProvider } from "../context/TasaProvider"
import IniciarCtaCorriente from "../pages/Tasa/CtasCtes/IniciarCtaCorriente"
import CuentaCorriente from "../pages/Tasa/CtasCtes/CuentaCorriente"
import Cedulones from "../pages/Tasa/Cedulones"
import CancelarCtaCte from "../pages/Tasa/CtasCtes/CancelarCtaCte"
import EliminarCancelacion from "../pages/Tasa/CtasCtes/EliminarCancelacion"

const Router = () => {
  const usuarioLogeado = localStorage.getItem("usuarioLogeado")
  const navigate = useNavigate()

  return (
    <>
      <UserProvider>
        <TasaProvider>
          {!usuarioLogeado ? (
            <Routes>
              <Route path="/*" element={<Login />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<TopMenu />}>
                <Route path="/" element={<Tasas />} />
                <Route path="/nuevaTasa" element={<NuevaTasa />} />
                <Route path="/detalle/:id" element={<TasaDetalle />} />
                <Route path="/editar/:id" element={<TasaEditar />} />
                <Route path="/iniciarctacte/:id" element={<IniciarCtaCorriente />} />
                <Route path="/cuenta-corriente/:id/" element={<CuentaCorriente />} />
                <Route path="/cedulones/" element={<Cedulones />} />
                <Route path="/cedulon-auto" element={<CedulonAuto />} />
                <Route path="/cancelar-cuenta/:id/" element={<CancelarCtaCte />} />
                <Route path="/eliminar-cancelacion/:id/" element={<EliminarCancelacion />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          )}
        </TasaProvider>
      </UserProvider>
    </>
  )
}

export default Router
