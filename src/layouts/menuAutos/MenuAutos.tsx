import Lucide from "../../base-components/Lucide";
import imageAuto from "../../assets/IconoAuto.svg";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const MenuAutos = () => {

  const navigate = useNavigate();


  if (true) {
    return (
      <>
        <div
          className="col-span-12 lg:col-span-2 2xl:col-span-2 containerctacte menu-auto"
          style={{ overflowY: "scroll", backgroundColor: "#164e63" }}
        >
          {/* BEGIN: Inbox Menu */}
          <div
            className="p-2 mt-6 intro-y box"
            style={{
              backgroundColor: "#164e63",
              marginTop: "0",
              borderRadius: "0",
            }}
          >
            <h2 style={{ color: "white" }}>
              <img
                style={{
                  height: "30px",
                  width: "auto",
                  display: "initial",
                  maxWidth: "30%",
                  marginRight: "15px",
                }}
                alt="Midone Tailwind HTML Admin Template"
                src={imageAuto}
              />
              MENU
            </h2>
            <hr />
            <div className="pt-1 mt-2 text-white border-t border-white/10 dark:border-darkmode-400">
              <Link
                to="nuevoVehiculo"
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="PlusSquare" className="w-4 h-4 mr-2" /> Nuevo
              </Link>
            </div>
          </div>
          {/* END: Inbox Menu */}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className="col-span-12 lg:col-span-2 2xl:col-span-2 containerctacte menu-auto"
          style={{ overflowY: "scroll", backgroundColor: "#164e63" }}
        >
          {/* BEGIN: Inbox Menu */}
          <div
            className="p-2 mt-6 intro-y box"
            style={{
              backgroundColor: "#164e63",
              marginTop: "0",
              borderRadius: "0",
            }}
          >
            <h2 style={{ color: "white" }}>
              <img
                style={{
                  height: "30px",
                  width: "auto",
                  display: "initial",
                  maxWidth: "30%",
                  marginRight: "15px",
                }}
                alt="Midone Tailwind HTML Admin Template"
                src={imageAuto}
              />
              MENU
            </h2>
            <div className="pt-1 mt-2 text-white border-t border-white/10 dark:border-darkmode-400">
              <Link
                to="#"
                className="flex items-center px-3 py-2 font-medium rounded-md"
              >
                <Lucide icon="PlusSquare" className="w-4 h-4 mr-2" /> Nuevo
              </Link>
            </div>
          </div>
          {/* END: Inbox Menu */}
        </div>
      </>
    );
  }
};

export default MenuAutos;
