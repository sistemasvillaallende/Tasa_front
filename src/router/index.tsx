import React, { useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
// Paginas
import Login from "../pages/Users/Login"
import Tasas from "../pages/Tasa/Tasas"
import TasaDetalle from "../pages/Tasa/TasaDetalle"
import TasaEditar from "../pages/Tasa/TasaEditar"
import IniciarCtaCorriente from "../pages/Tasa/CtasCtes/IniciarCtaCorriente"
import CuentaCorriente from "../pages/Tasa/CtasCtes/CuentaCorriente"
import Cedulones from "../pages/Tasa/Cedulones"
import CancelarCtaCte from "../pages/Tasa/CtasCtes/CancelarCtaCte"
import EliminarCancelacion from "../pages/Tasa/CtasCtes/EliminarCancelacion"
import ReLiquida from "../pages/Tasa/ReLiquida"
import CedulonTasa from "../pages/Tasa/Cedulones/CedulonTasa"
import Informes from "../pages/Informes"
import Deudas from "../pages/Tasa/Deudas/Deudas"
import DomicilioPostal from '../pages/Tasa/DomicilioPostal/DomicilioPostal'
import ConexionAgua from '../pages/Tasa/ConexionAgua/ConexionAgua'
import NotaBaldio from '../pages/Tasa/NotaBaldio/NotaBaldio'
import PorConceptos from "../pages/PorConceptos/PorConceptos"
import Conceptos from "../pages/Conceptos/Conceptos"
import Frente from "../pages/Frente/Frente"
import Header from "../components/Header"
import NotFound from "../pages/Errors/NotFound"
// Layouts
import TopMenu from "../layouts/TopMenu"
// Context
import { UserProvider } from "../context/UserProvider"
import { TasaProvider } from "../context/TasaProvider"
import { CedulonesProvider } from "../context/CedulonesProviders"
import { parseCIDICookie } from "../utils/cookieParser"
import { useUserContext } from "../context/UserProvider"

import TasaTable from "../pages/Tasa/TasaTable"

const RouterContent = () => {

  const { user, setUser } = useUserContext();

  useEffect(() => {
    const parsedUser = parseCIDICookie();
    if (parsedUser) {
      setUser(parsedUser);
    }
  }, []);

  // Si no hay usuario, renderizamos NotFound directamente
  if (!user) {
    return <NotFound />;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TopMenu />}>

          <Route path="/tasatable" element={<Tasas />} />
          <Route path="/" element={<TasaTable />} />

          <Route path="/detalle/:id" element={<TasaDetalle />} />
          <Route path="/detalle/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<TasaDetalle />} />

          <Route path="/editar/:id" element={<TasaEditar />} />
          <Route path="/editar/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<TasaEditar />} />

          <Route path="/iniciarctacte/:id" element={<IniciarCtaCorriente />} />
          <Route path="/iniciarctacte/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<IniciarCtaCorriente />} />

          <Route path="/cuenta-corriente/:id" element={<CuentaCorriente />} />
          <Route path="/cuenta-corriente/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<CuentaCorriente />} />

          <Route path="/cancelar-cuenta/:id" element={<CancelarCtaCte />} />
          <Route path="/cancelar-cuenta/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<CancelarCtaCte />} />

          <Route path="/eliminar-cancelacion/:id" element={<EliminarCancelacion />} />
          <Route path="/eliminar-cancelacion/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<EliminarCancelacion />} />

          <Route path="/cedulones/:id" element={<Cedulones />} />
          <Route path="/cedulones/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<Cedulones />} />

          <Route path="/reliquida/:id" element={<ReLiquida />} />
          <Route path="/reliquida/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<ReLiquida />} />

          <Route path="/informes/:id" element={<Informes />} />
          <Route path="/informes/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<Informes />} />

          <Route path="/deudas/:id" element={<Deudas />} />
          <Route path="/deudas/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<Deudas />} />

          <Route path="/domiciliopostal/:id" element={<DomicilioPostal />} />
          <Route path="/domiciliopostal/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<DomicilioPostal />} />

          <Route path="/conexionagua/:id" element={<ConexionAgua />} />
          <Route path="/conexionagua/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<ConexionAgua />} />

          <Route path="/baldio/:id" element={<NotaBaldio />} />
          <Route path="/baldio/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<NotaBaldio />} />

          <Route path="/conceptos/:id" element={<Conceptos />} />
          <Route path="/conceptos/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<Conceptos />} />

          <Route path="/frente/:id" element={<Frente />} />
          <Route path="/frente/:circunscripcion/:seccion/:manzana/:parcela/:p_h" element={<Frente />} />
        </Route>

        <Route path="/cedulonTasa/:nrocedulon" element={<CedulonTasa />} />
        <Route path="/por-conceptos" element={<PorConceptos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

const Router = () => {
  return (
    <UserProvider>
      <TasaProvider>
        <CedulonesProvider>
          <RouterContent />
        </CedulonesProvider>
      </TasaProvider>
    </UserProvider>
  )
}

export default Router
