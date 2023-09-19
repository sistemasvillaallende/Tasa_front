import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
//Paginas
import Login from "../pages/Users/Login";
import NotFound from "../pages/Errors/NotFound ";
import Tasas from "../pages/Tasa/Tasas";
import TasaVer from "../pages/Tasa/TasaVer";
import TasaEditar from "../pages/Tasa/TasaEditar";
//layouts
import TopMenu from "../layouts/TopMenu";
//Context
import { UserProvider } from "../context/UserProvider";
import { TasaProvider } from "../context/TasaProvider";


const Router = () => {
  const usuarioLogeado = sessionStorage.getItem("usuarioLogeado");
  const navigate = useNavigate();

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
                <Route path="/ver" element={<TasaVer />} />
                <Route path="/editar" element={<TasaEditar />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          )}
        </TasaProvider>
      </UserProvider>
    </>
  );
};

export default Router;
