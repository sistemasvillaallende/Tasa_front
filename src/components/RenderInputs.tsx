import { FormInput, FormSelect, FormSwitch } from "../base-components/Form"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { formSchema } from "../utils/formSchema"
import Lucide from "../base-components/Lucide"
import { useEffect } from "react"

export interface InputType {
  name: string
  type: string
  placeholder?: string
  label?: string
  disabled?: boolean
  minWidth?: string
  field?: string
  fields?: any
}

interface RenderInputsProps {
  list: any[]
  title?: string
  bgSlate?: boolean
  data: any
  formInputs: any
  setInputs: Function
}

const RenderInputs = ({ list, title, bgSlate, data, formInputs, setInputs }: RenderInputsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const { name, value } = target
    console.log("name", name, "value", value)
    setInputs({ ...formInputs, [name]: value })
    console.log(formInputs)
    if (target.type === "checkbox") {
      setInputs({ ...formInputs, [name]: target.checked })
    }
  }
  useEffect(() => {}, [])

  return (
    <div className={`p-5 mt-5 intro-y ${bgSlate && "bg-slate-50"}`}>
      {title && <h2 className="font-bold text-xl">{title}</h2>}
      <div className="flex flex-wrap justify-between">
        {list?.map((input: InputType, idx: number) => {
          if (input.fields) {
            return input.fields.map((inputField: { fieldName: string; frontName: string }) => {
              console.log("inputField", inputField.frontName)
              return (
                <label
                  key={`${idx}-${inputField.fieldName}`}
                  className="flex flex-col items-center grow mx-2 my-3"
                >
                  {inputField.frontName}
                  <FormSwitch.Input
                    name={inputField.fieldName}
                    className="shadow-md mt-2"
                    type="checkbox"
                    value={formInputs[inputField.fieldName as keyof typeof formInputs]}
                    onChange={handleChange}
                  />
                  <span className="text-warning text-right">
                    {/* {errors[input?.name]?.message as string} */}
                  </span>
                </label>
              )
            })
          }
          if (input?.type == "select")
            return (
              <label key={`${idx}-${input.name}`} className="flex flex-col grow mx-2 my-3">
                {input.label}
                <FormSelect
                  className={`shadow-md ${
                    input.minWidth == "m"
                      ? "min-w-[20vw]"
                      : input.minWidth == "l"
                      ? "min-w-[30vw]"
                      : ""
                  }`}
                  placeholder={input.placeholder}
                  name={input.name}
                >
                  <option value="">{input.placeholder}</option>
                  <option value="1">Seleccionar1</option>
                </FormSelect>
                <span className="text-warning text-right">
                  {/* {errors[input?.name]?.message as string} */}
                </span>
              </label>
            )
          else if (input.type == "checkbox")
            return (
              <label
                key={`${idx}-${input.name}`}
                className="flex flex-col items-center grow mx-2 my-3"
              >
                {input.label}
                <FormSwitch.Input
                  name={input.name}
                  className="shadow-md mt-2"
                  type="checkbox"
                  value={formInputs[input.field as keyof typeof formInputs]}
                  onChange={handleChange}
                />
                <span className="text-warning text-right">
                  {/* {errors[input?.name]?.message as string} */}
                </span>
              </label>
            )
          else if (input?.type == "radio")
            return (
              <label
                key={`${idx}-${input.name}`}
                className="flex flex-col items-center grow mx-2 my-3"
              >
                {input.label}
                <FormInput className="shadow-md mt-2" type="radio" rounded />
                <span className="text-warning text-right">
                  {/* {errors[input?.name]?.message as string} */}
                </span>
              </label>
            )
          if (input.type === "textarea")
            return (
              <label key={`${idx}-${input.name}`} className="flex flex-col grow mx-2 my-3">
                {input.label}
                <FormInput
                  className={`shadow-md h-full px-3 ${
                    input.minWidth == "m"
                      ? "min-w-[20vw]"
                      : input.minWidth == "l"
                      ? "min-w-[30vw]"
                      : ""
                  }`}
                  placeholder={input.placeholder}
                  type="textarea"
                  value={formInputs[input.name as keyof typeof formInputs]}
                />
                <span className="text-warning text-right">
                  {/* {errors[input?.name]?.message as string} */}
                </span>
              </label>
            )
          if (input.type === "date")
            return (
              <label key={`${idx}-${input.name}`} className="flex flex-col grow mx-2 my-3">
                {input.label}
                <FormInput
                  className={`shadow-md h-full px-3 ${
                    input.minWidth == "m"
                      ? "min-w-[20vw]"
                      : input.minWidth == "l"
                      ? "min-w-[30vw]"
                      : ""
                  }`}
                  placeholder={input.placeholder}
                  type="date"
                  value={formInputs[input.name as keyof typeof formInputs]}
                />
                <span className="text-warning text-right">
                  {/* {errors[input?.name]?.message as string} */}
                </span>
              </label>
            )
          else if (input.type === "text" || input.type === "number")
            return (
              <label key={`${idx}-${input.name}`} className="flex flex-col relative grow mx-2 my-3">
                {input.label}
                <FormInput
                  name={input.name}
                  className={`shadow-md ${
                    input.minWidth == "m"
                      ? "min-w-[20vw]"
                      : input.minWidth == "l"
                      ? "min-w-[30vw]"
                      : ""
                  }`}
                  type={input.type}
                  placeholder={input.placeholder}
                  onChange={handleChange}
                />
                {(input.name === "datosPropietario" || input.name === "calle") && (
                  <Lucide
                    icon="Search"
                    className="absolute right-0 w-4 h-4 my-auto mr-3 bottom-3 text-danger"
                  />
                )}
                <span className="text-warning text-right">
                  {/* {errors[input?.name]?.message as string} */}
                </span>
              </label>
            )
        })}
      </div>
    </div>
  )
}

export default RenderInputs
