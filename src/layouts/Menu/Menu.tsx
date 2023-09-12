import Lucide from "../../base-components/Lucide";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";

const MenuAutos = () => {

  const navigate = useNavigate();
  const { menuItems, menuIcon } = useUserContext();


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
                alt="Menu Icon"
                src={menuIcon}
              />
              MENU
            </h2>
            <hr />
            <div className="pt-1 mt-2 text-white border-t border-white/10 dark:border-darkmode-400">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.url}
                  className="flex items-center px-3 py-2 font-medium rounded-md"
                >
                  <Lucide icon={item.icono} className="w-4 h-4 mr-2" />{item.texto}</Link>
              ))}
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
