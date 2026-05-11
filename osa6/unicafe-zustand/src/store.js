import { create } from 'zustand'

const useStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  increaseGood: () => set((state) => ({ good: state.good + 1 })),
  increaseNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
  increaseBad: () => set((state) => ({ bad: state.bad + 1 })),
}))

export default useStore
