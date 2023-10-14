import { create } from 'zustand'

interface AppState {
  isConnect: boolean
  changeIsConnect: (by: boolean) => void
  showSwitchDialog: boolean
  switchDialogType: string
  changeShowSwitchDialog: (show: boolean, to: string) => void
}

const useAppStore = create<AppState>((set) => ({
  isConnect: false,
  changeIsConnect: (isConnect: boolean) => set(() => ({ isConnect })),
  showSwitchDialog: false,
  switchDialogType: '',
  changeShowSwitchDialog: (show, to) => {
    set(() => ({ showSwitchDialog: show, switchDialogType: to }))
  },
}))

export default useAppStore
