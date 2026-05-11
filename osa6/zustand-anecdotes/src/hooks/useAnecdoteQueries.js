import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote, updateAnecdote } from '../requests'

export const useAnecdoteMutation = () => {
  const queryClient = useQueryClient()

  // uuden anekdootin lisäämis hook
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  // äänestämis hook
  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  return {
    addAnecdote: newAnecdoteMutation.mutate,
    voteAnecdote: voteMutation.mutate,
  }
}
