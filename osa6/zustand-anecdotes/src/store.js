import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },

    // 6.8
    createAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }))
    },

    // 6.9
    vote: async (id) => {
      const anecdoteToChange = get().anecdotes.find((a) => a.id === id)

      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }

      const updatedAnecdote = await anecdoteService.update(id, changedAnecdote)

      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id !== id ? a : updatedAnecdote,
        ),
      }))
    },
    deleteAnecdote: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }))
    },
    setFilter: (filter) => set({ filter }),
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)
