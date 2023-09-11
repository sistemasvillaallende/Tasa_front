import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Tasa } from "../interfaces/Tasa";

type TasaContextType = {
    tasa: Tasa | null;
    traerTasa: (id: number) => void;
    setTasa: (tasa: Tasa) => void;
};

const tasaContext = createContext<TasaContextType>({
    tasa: null,
    traerTasa: () => { },
    setTasa: () => { },
});

export function useTasaContext() {
    return useContext(tasaContext);
}

export function TasaProvider({ children }: any) {
    const [tasa, setTasa] = useState<Tasa | null>(null);


    const traerTasa = async (id: number) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_URL_TASA}GetTasaById?id=${id}`
            );
            setTasa(response.data);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error al buscar la Tasa",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#27a3cf",
            });
        }
    };


    return (
        <tasaContext.Provider
            value={{
                traerTasa,
                tasa,
                setTasa,
            }}
        >
            {children}
        </tasaContext.Provider>
    );
}
