import React, { useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
//Paginas
import Login from "../pages/Users/Login"
import NotFound from "../pages/Errors/NotFound "
import Tasas from "../pages/Tasa/Tasas"
import TasaDetalle from "../pages/Tasa/TasaDetalle"
import TasaEditar from "../pages/Tasa/TasaEditar"
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
import ReLiquida from "../pages/Tasa/ReLiquida"
import CedulonTasa from "../pages/Tasa/Cedulones/CedulonTasa"
import { CedulonesProvider } from "../context/CedulonesProviders"
import Informes from "../pages/Informes"
import Deudas from "../pages/Tasa/Deudas/Deudas"
import DomicilioPostal from '../pages/Tasa/DomicilioPostal/DomicilioPostal'
import ConexionAgua from '../pages/Tasa/ConexionAgua/ConexionAgua'
import NotaBaldio from '../pages/Tasa/NotaBaldio/NotaBaldio'
import PorConceptos from "../pages/PorConceptos/PorConceptos"
import Conceptos from "../pages/Conceptos/Conceptos"
import Frente from "../pages/Frente/Frente"
import Header from "../components/Header";

const Router = () => {
  const usuarioLogeado = localStorage.getItem("usuarioLogeado")
  const navigate = useNavigate()

  return (
    <UserProvider>
      <TasaProvider>
        <CedulonesProvider>
          {!usuarioLogeado ? (
            <Routes>
              <Route path="/*" element={<Login />} />
              <Route path="/CIDI/:codigoCIDI" element={<Login />} />
            </Routes>
          ) : (
            <>
              <Header />
              <Routes>
                <Route path="/" element={<TopMenu />}>
                  <Route path="/" element={<Tasas />} />
                  <Route path="/detalle/:id" element={<TasaDetalle />} />
                  <Route path="/editar/:id" element={<TasaEditar />} />
                  <Route path="/iniciarctacte/:id" element={<IniciarCtaCorriente />} />
                  <Route path="/cuenta-corriente/:id" element={<CuentaCorriente />} />
                  <Route path="/cedulones/:id" element={<Cedulones />} />
                  <Route path="/cancelar-cuenta/:id" element={<CancelarCtaCte />} />
                  <Route path="/eliminar-cancelacion/:id" element={<EliminarCancelacion />} />
                  <Route path="/reliquida/:id" element={<ReLiquida />} />
                  <Route path="/informes/:id" element={<Informes />} />
                  <Route path="/deudas/:id" element={<Deudas />} />
                  <Route path="/domiciliopostal/:id" element={<DomicilioPostal />} />
                  <Route path="/conexionagua/:id" element={<ConexionAgua />} />
                  <Route path="/baldio/:id" element={<NotaBaldio />} />
                  <Route path="/por-conceptos" element={<PorConceptos />} />
                  <Route path="/conceptos/:id" element={<Conceptos />} />
                  <Route path="/frente/:id" element={<Frente />} />
                </Route>
                <Route path="/cedulonTasa/:nrocedulon" element={<CedulonTasa />} />
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<NotFound />} />
              </Routes>
            </>
          )}
        </CedulonesProvider>
      </TasaProvider>
    </UserProvider>
  )
}

export default Router
