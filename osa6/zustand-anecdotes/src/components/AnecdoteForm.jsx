import { useNotificationDispatch } from '../NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotify } from '../NotificationContext'

const AnecdoteForm = () => {
  // välimuistin hallintaa varten
  const queryClient = useQueryClient()

  // hookit ilmoituksia varten
  const dispatch = useNotificationDispatch()
  const notify = useNotify()

  //mutaatio anekdootin luomista varten
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote, // tekee http pyynnön
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: (error) => {
      notify(error.message)
    },
  })

  // käsittelee lomakkeen lähetyksen
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    // jos alle 5 merkkiä pitkä, annetaan virheilmoitus
    if (content.length < 5) {
      dispatch({
        type: 'SET',
        payload: 'too short anecdote, must have length 5 or more',
      })
      return
    }
    // mutaation suoritus, lähettää anekdootin palvelimille
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
