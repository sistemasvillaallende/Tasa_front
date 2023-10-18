export interface InputType {
  name: string
  type: string
  placeholder?: string
  label?: string
  disabled?: boolean
  minWidth?: string
  field?: string
  fields?: { fieldName: string; frontName: string }[]
}

interface RenderInputsProps {
  data: any
  list: any[]
  setOpenModalDatos?: Function
  setOpenModalCalle?: Function
  title?: string
  bgSlate?: boolean
}

const RenderTexts = ({ data, list, title, bgSlate }: RenderInputsProps) => {
  const renderBoolean = (data: boolean) => {
    return data ? "Si" : "No"
  }
  return (
    <div className={`p-5 mt-5 intro-y ${bgSlate && "bg-slate-100"}`}>
      {title && <h2 className="font-bold text-xl">{title}</h2>}
      <div className="flex flex-wrap justify-between">
        {list?.map((input: InputType, idx: number) => {
          console.log("data[input.name]", data, input.name)
          return (
            <div key={`${idx}-${input.name}`} className="flex flex-col relative grow mx-2 my-3">
              <h3 className="font-bold">{input.label}</h3>
              {input.field && (
                <span
                  className={`border-b-2 m3-3 ${
                    input.minWidth == "m"
                      ? "min-w-[20vw]"
                      : input.minWidth == "l"
                      ? "min-w-[30vw]"
                      : ""
                  }`}
                >
                  {typeof data?.[input.field] === "boolean"
                    ? renderBoolean(data?.[input.field])
                    : data?.[input.field]}
                </span>
              )}
              {input.fields && (
                <div
                  className={`flex justify-between m3-3 ${
                    input.minWidth == "m"
                      ? "min-w-[20vw]"
                      : input.minWidth == "l"
                      ? "min-w-[30vw]"
                      : ""
                  }`}
                >
                  {input.fields.map((ele: { fieldName: string; frontName: string }) => {
                    return (
                      <label className="flex flex-col  items-center">
                        {ele.frontName} <br />
                        {data?.[ele.fieldName] ? (
                          <input
                            type="checkbox"
                            checked={data[ele.fieldName]}
                            className="mt-2 rounded border-slate-300 tc"
                            disabled
                          />
                        ) : (
                          <span className="font-bold">No</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RenderTexts
