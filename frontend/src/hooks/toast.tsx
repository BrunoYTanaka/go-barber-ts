import React, { createContext, useContext, useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'
import ToastContainer from '../components/ToastContainer'

export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  title: string
  description?: string
}

interface ToastContextData {
  messages: ToastMessage[]
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    ({ title, type, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid()
      const toast = {
        id,
        type,
        description,
        title,
      }
      setMessages(oldMessages => [...oldMessages, toast])
    },
    [],
  )

  const removeToast = useCallback((id: string) => {
    setMessages(oldMessages => oldMessages.filter(message => message.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ messages, removeToast, addToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  return context
}

export { ToastProvider, useToast }
