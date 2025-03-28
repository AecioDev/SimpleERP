"use client"

import type React from "react"

import { createContext, useState, useEffect } from "react"

// Tipos para o contexto de autenticação
export interface User {
  id: number
  name: string
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Criação do contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
})

// Função para gerar senha alternativa baseada na data
const generateAlternativePassword = (): string => {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  // Algoritmo simples: multiplica dia pelo mês e soma com o ano
  const baseNumber = day * month + year

  // Gera um número de 6 dígitos
  return String(baseNumber % 1000000).padStart(6, "0")
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Função de login
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simula uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verifica se é o usuário ADMIN com senha fixa ou alternativa
    if (username === "admin" && (password === "987321" || password === generateAlternativePassword())) {
      const adminUser: User = {
        id: 1,
        name: "Administrador",
        username: "admin",
        role: "ADMIN",
      }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
      return true
    }

    // Usuários de exemplo para demonstração
    const demoUsers = [
      { id: 2, name: "João Silva", username: "joao", password: "123456", role: "Vendas" },
      { id: 3, name: "Maria Souza", username: "maria", password: "123456", role: "Financeiro" },
      { id: 4, name: "Pedro Santos", username: "pedro", password: "123456", role: "Estoque" },
    ]

    const foundUser = demoUsers.find((u) => u.username === username && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  // Função de logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

