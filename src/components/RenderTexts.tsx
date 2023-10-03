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

const RenderTexts = ({ list, title, bgSlate }: RenderInputsProps) => {
  return (
    <div className={`p-5 mt-5 intro-y ${bgSlate && "bg-slate-100"}`}>
      {title && <h2 className="font-bold text-xl">{title}</h2>}
      <div className="flex flex-wrap justify-between">
        {list?.map((input: InputType, idx: number) => {
          return (
            <div key={`${idx}-${input.name}`} className="flex flex-col relative grow mx-2 my-3">
              <h3 className="font-bold">{input.label}</h3>
              <span
                className={`border-b-2 m3-3 ${
                  input.minWidth == "m"
                    ? "min-w-[20vw]"
                    : input.minWidth == "l"
                    ? "min-w-[30vw]"
                    : ""
                }`}
              >
                {input.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RenderTexts
