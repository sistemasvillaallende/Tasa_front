import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { icons } from "../base-components/Lucide"

export interface Menu {
  icon: keyof typeof icons
  title: string
  pathname?: string
  subMenu?: Menu[]
  ignore?: boolean
}

export interface SideMenuState {
  menu: Array<Menu | "divider">
}

const initialState: SideMenuState = {
  menu: [],
}

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    updateSideMenu: (state, action: PayloadAction<Array<Menu | "divider">>) => {
      state.menu = action.payload
    },
  },
})

export const { updateSideMenu } = sideMenuSlice.actions

export const selectSideMenu = (state: RootState) => state.sideMenu.menu

export default sideMenuSlice.reducer
