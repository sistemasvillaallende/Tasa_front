import { useEffect, useState } from "react";
import axios from "axios";
import {
    FormSelect,
    FormInput,
    FormLabel,
    FormSwitch,
    InputGroup,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUserContext } from "../../context/UserProvider";
import Lucide from "../../base-components/Lucide";


const TasaEditar = () => {
    const { user } = useUserContext();

    const navigate = useNavigate();


    useEffect(() => {

    }, []);

    const cancelar = () => {
        navigate(-1);
    };


    return (
        <>
            <div className="conScroll grid grid-cols-12 gap-6 mt-5 ml-5 mr-4 sinAnimaciones">
                <div className="col-span-12 intro-y lg:col-span-12">
                    <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12">
                        <h2>Datos Propiedad</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-3">
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="fomrDominio">Dominio</FormLabel>
                            <FormInput
                                id="fomrDominio"
                                type="text"
                                value={0}
                                disabled
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-5">
                            <FormLabel htmlFor="formMarca">Marca</FormLabel>
                            <FormInput
                                id="formMarca"
                                type="text"
                                value={0}
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formAnio">Año</FormLabel>
                            <FormInput
                                id="formAnio"
                                type="number"
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-3">
                            <FormLabel htmlFor="forCIP">C.I.P.</FormLabel>
                            <InputGroup>
                                <FormInput
                                    id="forCIP"
                                    type="text"
                                />
                                <InputGroup.Text
                                    id="input-group-price"
                                    className="cursor-pointer"
                                >
                                    <Lucide icon="Search" className="w-4 h-4" />
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-5">
                            <FormLabel htmlFor="formModelo">Modelo</FormLabel>
                            <FormInput
                                id="formModelo"
                                type="text"
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-5">
                            <FormLabel htmlFor="regular-form-1">Tipo de Vehículo</FormLabel>
                            <FormSelect
                                className="sm:mr-2"
                                aria-label="Default select example"
                            >
                            </FormSelect>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-1">
                            <FormLabel htmlFor="formNacional">Nacional</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="formNacional"
                                    type="checkbox"
                                />
                            </FormSwitch>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-1">
                            <FormLabel htmlFor="formTipoAlta">Normal</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="formTipoAlta"
                                    type="checkbox"
                                    disabled
                                />
                            </FormSwitch>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formFechaDeAlta">Fecha de Alta</FormLabel>
                            <FormInput
                                type="date"
                                id="formFechaDeAlta"
                                disabled
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-4">
                            <FormLabel htmlFor="formNroMotor">Nro. de Motor</FormLabel>
                            <FormInput
                                id="formNroMotor"
                                type="text"

                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="regular-form-1">Peso / Cm3</FormLabel>
                            <FormInput
                                id="regular-form-1"
                                type="number"

                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-12">
                            <h2>Datos del Propietario</h2>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-5">
                            <FormLabel htmlFor="formPropietario">Propietario</FormLabel>
                            <FormInput
                                id="formPropietario"
                                type="text"

                                disabled
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formNroBad">Nro. Bad.</FormLabel>
                            <FormInput
                                id="formNroBad"
                                type="number"

                                disabled
                            />
                        </div>

                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formResponsable">Responsable</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="formResponsable"
                                    type="checkbox"
                                />
                            </FormSwitch>
                        </div>

                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formNroDeDocumendo">
                                Nro. de Documento
                            </FormLabel>
                            <FormInput
                                id="formNroDeDocumendo"
                                type="number"
                                disabled
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formCUIT">CUIT</FormLabel>
                            <FormInput
                                id="formCUIT"
                                type="number"
                                disabled
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formCuitVecinoDigital">
                                CUIT vecino Digital
                            </FormLabel>
                            <FormInput
                                id="formCuitVecinoDigital"
                                type="number"
                                disabled
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formPorcentaje">Porcentaje %</FormLabel>
                            <FormInput
                                id="formPorcentaje"
                                type="number"
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="regular-form-1">Vecino Digital</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="checkbox-switch-7"
                                    type="checkbox"

                                    disabled
                                />
                            </FormSwitch>
                        </div>

                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="FormEmiteCedulon">Emite Cedulón</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="FormEmiteCedulon"
                                    type="checkbox"
                                    disabled
                                />
                            </FormSwitch>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="formUltimoPeriodoDeLiquidacion">
                                Último Periodo de Liquidación
                            </FormLabel>
                            <FormInput
                                id="formUltimoPeriodoDeLiquidacion"
                                type="text"
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-4">
                            <FormLabel htmlFor="formClaveDePago">Clave de Pago</FormLabel>
                            <FormInput
                                id="formClaveDePago"
                                type="number"
                                disabled
                            />
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-12">
                            <h2>Situación Tributaria</h2>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="regular-form-1">Excento</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="checkbox-switch-7"
                                    type="checkbox"
                                />
                            </FormSwitch>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="regular-form-1">Tributa Mínimo</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="checkbox-switch-7"
                                    type="checkbox"
                                />
                            </FormSwitch>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-2">
                            <FormLabel htmlFor="regular-form-1">Debito Automático</FormLabel>
                            <FormSwitch>
                                <FormSwitch.Input
                                    id="checkbox-switch-7"
                                    type="checkbox"
                                    disabled
                                />
                            </FormSwitch>
                        </div>
                    </div>
                    <br />
                    <div className="flex w-full justify-between col-span-12 intro-y lg:col-span-12 mt-5 mb-5">
                        <div className="col-span-12 intro-y lg:col-span-4">
                            <FormLabel htmlFor="formFechaDeAlta">Fecha de Alta</FormLabel>
                        </div>
                        <div className="col-span-12 intro-y lg:col-span-3">
                            <Button
                                variant="primary"
                                className="ml-3"
                            >
                                Guardar
                            </Button>
                            <Button variant="secondary" className="ml-3" onClick={cancelar}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TasaEditar