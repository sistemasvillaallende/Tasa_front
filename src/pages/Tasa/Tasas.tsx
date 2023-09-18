import { useState } from "react";
import Lucide from "../../base-components/Lucide";
import {
    FormInput,
    FormLabel,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import Table from "../../base-components/Table";
import { useParams, useNavigate } from "react-router-dom";



interface Contribuyente {
    nombre: string;
    apellido: string;
    cuit: string;
    direccion: string;
    telefono: string;
    email: string;
}

const Tasas = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [cuit, setCuit] = useState("");
    const [searchResult, setSearchResult] = useState<Contribuyente | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSearch = () => {
        const cuitRegex = /^\d{11}$/;

        if (cuit) {
            if (!cuitRegex.test(cuit)) {
                setError("El CUIT debe tener 11 dígitos numéricos.");
                return;
            }

            const result: Contribuyente = {
                nombre: "",
                apellido: "",
                cuit: cuit,
                direccion: "Av. Siempre Viva 123",
                telefono: "555-1234",
                email: "juan.perez@example.com",
            };

            setSearchResult(result);
            setError(null);
        } else if (nombre) {
            if (nombre.length < 3) {
                setError("El nombre debe tener al menos 3 caracteres.");
                return;
            }

            const result: Contribuyente = {
                nombre: nombre,
                apellido: "Perez",
                cuit: "20351598647",
                direccion: "Av. Siempre Viva 123",
                telefono: "555-1234",
                email: "juan.perez@example.com",
            };

            setSearchResult(result);
            setError(null);
        } else {
            setError("Debe ingresar un nombre o un CUIT.");
        }
    };

    const handleVerContribuyente = () => {
        navigate("/ver");
    };

    return (
        <div className="conScroll grid grid-cols-12 gap-6">
            <div className="col-span-12 intro-y lg:col-span-12">
                <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
                    <h2 className="text-lg font-medium">Buscar Persona</h2>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 intro-y lg:col-span-4">
                        <FormLabel htmlFor="nombre">Nombre, Apellido o Razón Social</FormLabel>
                        <FormInput
                            id="nombre"
                            type="text"
                            placeholder="Razón Social"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="col-span-12 intro-y lg:col-span-3">
                        <FormLabel className="ml-4" htmlFor="cuit">CUIT:</FormLabel>
                        <FormInput
                            id="cuit"
                            type="text"
                            placeholder="Ingrese el CUIT"
                            value={cuit}
                            onChange={(e) => setCuit(e.target.value)}
                        />
                    </div>
                    <div className="col-span-12 intro-y lg:col-span-1">
                        <Button onClick={handleSearch} className="ml-2 mt-7">
                            Buscar
                        </Button>
                    </div>
                    <div className="col-span-12 intro-y lg:col-span-12">
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                    <div className="col-span-12 intro-y lg:col-span-12">
                        {searchResult && (
                            <div className="mt-4">
                                <h3>Resultado de la búsqueda:</h3>
                                <p>Nombre: {searchResult.nombre} {searchResult.apellido}</p>
                                <p>CUIT: {searchResult.cuit}</p>
                                <p>Dirección: {searchResult.direccion}</p>
                                <p>Teléfono: {searchResult.telefono}</p>
                                <p>Email: {searchResult.email}</p>
                                <Button onClick={handleVerContribuyente} className="ml-2 mt-7">
                                    Ver Tasas
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table striped>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap">Nro BADEC</Table.Th>
                                <Table.Th className="whitespace-nowrap">BADEC</Table.Th>
                                <Table.Th className="whitespace-nowrap">CUIT</Table.Th>
                                <Table.Th className="whitespace-nowrap">
                                    Calle Frente
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap">
                                    Nro
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap">
                                    Barrio
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap">
                                    Acciones
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>38658</Table.Td>
                                <Table.Td>Arias Agapito Aurelio</Table.Td>
                                <Table.Td>20351598647</Table.Td>
                                <Table.Td>Matadero</Table.Td>
                                <Table.Td>410</Table.Td>
                                <Table.Td>Las Polinesias</Table.Td>
                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                    <Button
                                        variant="secondary"
                                        className="mb-2 mr-1"
                                        onClick={() => handleVerContribuyente()}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Lucide icon="Eye" className="w-5 h-5" />
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>38659</Table.Td>
                                <Table.Td>Lopez Maria</Table.Td>
                                <Table.Td>20351234567</Table.Td>
                                <Table.Td>Calle Principal</Table.Td>
                                <Table.Td>123</Table.Td>
                                <Table.Td>Los Pinos</Table.Td>
                                <Table.Td>
                                    <Button
                                        variant="secondary"
                                        className="mb-2 mr-1"
                                        onClick={() => handleVerContribuyente()}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Lucide icon="Eye" className="w-5 h-5" />
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Td>38660</Table.Td>
                                <Table.Td>Gonzalez Juan</Table.Td>
                                <Table.Td>20352345678</Table.Td>
                                <Table.Td>Avenida Central</Table.Td>
                                <Table.Td>789</Table.Td>
                                <Table.Td>El Rosario</Table.Td>
                                <Table.Td>
                                    <Button
                                        variant="secondary"
                                        className="mb-2 mr-1"
                                        onClick={() => handleVerContribuyente()}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Lucide icon="Eye" className="w-5 h-5" />
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>

                </div>
            </div >
        </div >
    );
};

export default Tasas;


