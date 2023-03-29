import { ReactNode, useEffect, useState, useCallback } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface Transactions {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionsContextType {
  transactions: Transactions[]
  fetchTransactions: (query: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

export const TransactionsContext = createContext({} as TransactionsContextType)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTranscations] = useState<Transactions[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    // testing api without axios
    // const url = new URL('http://localhost:3000/transactions')
    // if (query) {
    //   url.searchParams.append('q', query)
    // }

    // const response = await fetch(url)
    // const data = await response.json()

    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTranscations(response.data)
  }, [])

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data

      const response = await api.post('transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })

      setTranscations((state) => [response.data, ...state])
    },
    [],
  )

  useEffect(() => {
    // Versão simples
    // fetch('http://localhost:3000/transactions/').then((response) => {
    //   response.json().then((data) => {
    //     console.log(data)
    //   })
    // })

    // versão alinhada (quando há dois then)
    // fetch('http://localhost:3000/transactions/')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data)
    //   })

    // versão com async juntamente com useEffect
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
