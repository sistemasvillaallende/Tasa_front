import React from 'react'
import {
    PreviewComponent,
    Preview,
    Source,
    Highlight,
} from "../../base-components/PreviewComponent";
import {
    FormSelect,
    FormInput,
    FormLabel,
    FormHelp,
    FormCheck,
    FormSwitch,
    FormInline,
    InputGroup,
} from "../../base-components/Form";
import Button from "../../base-components/Button";

const TasaVer = () => {
    return (
        <div className="mt-5 ml-2 mr-2">
            <h2>Ubicación</h2>
            <div>
                <FormLabel htmlFor="regular-form-1">Calle Frente Principal</FormLabel>
                <FormInput id="regular-form-1" type="text" placeholder="Input text" />
            </div>
        </div>
    )
}

export default TasaVer