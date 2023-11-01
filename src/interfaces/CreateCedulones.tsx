import { VCtasctes } from "./VCtasctes"

export interface CreateCedulones {
  nroCedulon: number
  cir: number
  sec: number
  man: number
  par: number
  p_h: number
  vencimiento: string
  monto_cedulon: number
  nroProc: number
  listaDeuda: VCtasctes[]
}
