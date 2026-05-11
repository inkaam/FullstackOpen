const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  const data = await response.json()
  return data
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  }
  const response = await fetch(baseUrl, options)
  if (!response.ok) throw new Error('Failed to create anecdote')
  return await response.json()
}
const update = async (id, newObject) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newObject),
  }
  const response = await fetch(`${baseUrl}/${id}`, options)
  return await response.json()
}
const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete anecdote')
  }

  return response
}
export default { getAll, createNew, update, remove }
