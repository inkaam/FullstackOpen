import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  type: null,
  setNotification: (message, type, seconds = 5) => {
    set({ message, type })
    setTimeout(() => {
      set({ message: null, type: null })
    }, seconds * 1000)
  },
}))

export default useNotificationStore