import { useFilter, useAnecdoteActions } from '../store'
import { useAnecdoteMutation } from '../hooks/useAnecdoteQueries'
import { useNotify } from '../NotificationContext'

const AnecdoteList = ({ anecdotes }) => {
  const filter = useFilter()
  const { deleteAnecdote } = useAnecdoteActions()
  const notify = useNotify()
  const { voteAnecdote } = useAnecdoteMutation()

  // käsittelee äänestämisen
  const handleVote = (anecdote) => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    voteAnecdote(updated)
    notify(`you voted '${anecdote.content}'`)
  }
  // käsittelee poistamisen
  const handleDelete = (anecdote) => {
    if (window.confirm(`Delete '${anecdote.content}'?`)) {
      deleteAnecdote(anecdote.id)
      notify(`deleted '${anecdote.content}'`)
    }
  }
  // suodattaa hakusanan perusteella jja niin että eniten ääniä saanut on ensin
  const anecdotesToShow = anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {anecdotesToShow.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{ marginBottom: 10, borderBottom: '1px solid #ccc' }}
        >
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {/* poisto näkyy vaan jos 0 ääntä */}
            {anecdote.votes === 0 && (
              <button
                onClick={() => handleDelete(anecdote)}
                style={{ marginLeft: 5, color: 'red' }}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
