import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'

import * as storeHooks from './store'

const useAnecdoteStore = storeHooks.useAnecdoteStore

import anecdoteService from './services/anecdotes'
import AnecdoteList from './components/AnecdoteList'
import React from 'react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn(),
    createNew: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('./hooks/useAnecdoteQueries', () => ({
  useAnecdoteMutation: () => ({ voteAnecdote: vi.fn() }),
}))

vi.mock('./NotificationContext', () => ({
  useNotify: () => vi.fn(),
  NotificationProvider: ({ children }) => <div>{children}</div>,
}))


describe('Anecdote Tests', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
  })

  // 6.12
  it('state is initialized with anecdotes from backend', async () => {
    const mockAnecdotes = [
      { content: 'test 1', id: '1', votes: 0 },
      { content: 'test 2', id: '2', votes: 5 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteStore())

    await act(async () => {
      await result.current.actions.initialize()
    })

    expect(result.current.anecdotes).toHaveLength(2)
    expect(result.current.anecdotes).toEqual(mockAnecdotes)
  })

  // 6.13 6.14
  describe('AnecdoteList logic', () => {
    const anecdotes = [
      { content: 'first', id: '1', votes: 1 },
      { content: 'second', id: '2', votes: 10 },
      { content: 'third', id: '3', votes: 5 },
    ]

    it('anecdotes are sorted by votes', () => {
      vi.spyOn(storeHooks, 'useFilter').mockReturnValue('')

      render(<AnecdoteList anecdotes={anecdotes} />)

      const items = screen.getAllByText(/has \d+/)
      expect(items[0]).toHaveTextContent('has 10')
      expect(items[1]).toHaveTextContent('has 5')
      expect(items[2]).toHaveTextContent('has 1')
    })

    it('list is filtered correctly', () => {
      vi.spyOn(storeHooks, 'useFilter').mockReturnValue('sec')

      render(<AnecdoteList anecdotes={anecdotes} />)

      expect(screen.getByText('second')).toBeDefined()
      expect(screen.queryByText('first')).toBeNull()
      expect(screen.queryByText('third')).toBeNull()
    })
  })

  // 6.15
  it('voting increases the vote count in state', async () => {
    const initialAnecdote = { content: 'vote me', id: '1', votes: 0 }
    const updatedAnecdote = { content: 'vote me', id: '1', votes: 1 }

    useAnecdoteStore.setState({ anecdotes: [initialAnecdote] })
    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    const { result } = renderHook(() => useAnecdoteStore())

    await act(async () => {
      await result.current.actions.vote('1')
    })

    const anecdote = result.current.anecdotes.find((a) => a.id === '1')
    expect(anecdote.votes).toBe(1)
  })
})
