import { FormInput, FormSelect } from "../base-components/Form"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { formSchema } from "../utils/formSchema"
import Lucide from "../base-components/Lucide"

export interface InputType {
  name: string
  type: string
  placeholder?: string
  label?: string
  disabled?: boolean
  minWidth?: string
}

interface RenderInputsProps {
  list: any[]
  setOpenModalDatos?: Function
  setOpenModalCalle?: Function
  title?: string
  bgSlate?: boolean
}

const RenderInputs = ({
  list,
  setOpenModalDatos,
  setOpenModalCalle,
  title,
  bgSlate,
}: RenderInputsProps) => {
  const {
    register,
    // handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })

  return (
    <div className={`p-5 mt-5 intro-y ${bgSlate && "bg-slate-50"}`}>
      {title && <h2 className="font-bold text-xl">{title}</h2>}
      <div className="flex flex-wrap justify-between">
        {list?.map((input: InputType, idx: number) => {
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
                  {errors[input?.name]?.message as string}
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
                <FormInput className="shadow-md mt-2" type="checkbox" {...register(input.name)} />
                <span className="text-warning text-right">
                  {errors[input?.name]?.message as string}
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
                <FormInput
                  className="shadow-md mt-2"
                  type="radio"
                  rounded
                  {...register(input.name)}
                />
                <span className="text-warning text-right">
                  {errors[input?.name]?.message as string}
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
                  {...register(input.name)}
                />
                <span className="text-warning text-right">
                  {errors[input?.name]?.message as string}
                </span>
              </label>
            )
          else if (input.type === "text" || input.type === "number")
            return (
              <label key={`${idx}-${input.name}`} className="flex flex-col relative grow mx-2 my-3">
                {input.label}
                <FormInput
                  className={`shadow-md ${
                    input.minWidth == "m"
                      ? "min-w-[20vw]"
                      : input.minWidth == "l"
                      ? "min-w-[30vw]"
                      : ""
                  }`}
                  type={input.type}
                  placeholder={input.placeholder}
                  onFocus={(e: any) => {
                    if (e.target.name === "datosPropietario") setOpenModalDatos?.(true)
                    else if (e.target.name === "calle") setOpenModalCalle?.(true)
                  }}
                  {...register(input.name)}
                />
                {(input.name === "datosPropietario" || input.name === "calle") && (
                  <Lucide
                    icon="Search"
                    className="absolute right-0 w-4 h-4 my-auto mr-3 bottom-3 text-danger"
                  />
                )}
                <span className="text-warning text-right">
                  {errors[input?.name]?.message as string}
                </span>
              </label>
            )
        })}
      </div>
    </div>
  )
}

export default RenderInputs
