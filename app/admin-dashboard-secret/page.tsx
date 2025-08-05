"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Users, Gift, Calendar } from "lucide-react"

interface GuestResponse {
  name: string
  attendance: "yes" | "no"
  timestamp: string
}

interface GiftMessage {
  name: string
  message: string
  giftType: string
  giftValue?: number
  timestamp: string
}

export default function AdminDashboard() {
  const [responses, setResponses] = useState<GuestResponse[]>([])
  const [gifts, setGifts] = useState<GiftMessage[]>([])

  useEffect(() => {
    // In a real app, you'd fetch from your database/spreadsheet
    // For demo purposes, we'll use mock data
    const mockResponses: GuestResponse[] = [
      { name: "João Silva", attendance: "yes", timestamp: "2024-01-15T10:30:00Z" },
      { name: "Maria Santos", attendance: "yes", timestamp: "2024-01-15T11:45:00Z" },
      { name: "Pedro Oliveira", attendance: "no", timestamp: "2024-01-15T14:20:00Z" },
      { name: "Ana Costa", attendance: "yes", timestamp: "2024-01-16T09:15:00Z" },
    ]

    const mockGifts: GiftMessage[] = [
      {
        name: "João Silva",
        message: "Desejamos muito amor e felicidade para vocês dois!",
        giftType: "Jantar Romântico",
        giftValue: 100,
        timestamp: "2024-01-15T10:35:00Z",
      },
      {
        name: "Ana Costa",
        message: "Que Deus abençoe esta união! Muito amor para vocês!",
        giftType: "Lua de Mel Básica",
        giftValue: 250,
        timestamp: "2024-01-16T09:20:00Z",
      },
    ]

    setResponses(mockResponses)
    setGifts(mockGifts)
  }, [])

  const confirmedGuests = responses.filter((r) => r.attendance === "yes")
  const declinedGuests = responses.filter((r) => r.attendance === "no")
  const totalGiftValue = gifts.reduce((sum, gift) => sum + (gift.giftValue || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-gray-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Dashboard do Casamento</h1>
          </div>
          <p className="text-gray-600">Natália & Matheus - 15 de Junho, 2024</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedGuests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Comparecerão</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{declinedGuests.length}</div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total em Presentes</CardTitle>
              <Gift className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalGiftValue}</div>
            </CardContent>
          </Card> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guest Responses */}
          <Card>
            <CardHeader>
              <CardTitle>Confirmações de Presença</CardTitle>
              <CardDescription>Lista de todos os convidados que responderam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{response.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(response.timestamp).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(response.timestamp).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant={response.attendance === "yes" ? "default" : "destructive"}>
                    {response.attendance === "yes" ? "Confirmado" : "Não vai"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gift Messages */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Presentes e Mensagens</CardTitle>
              <CardDescription>Mensagens carinhosas dos convidados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gifts.map((gift, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{gift.name}</p>
                    <Badge variant="outline">R$ {gift.giftValue}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{gift.giftType}</p>
                  <Separator />
                  <p className="text-sm italic">"{gift.message}"</p>
                  <p className="text-xs text-gray-500">
                    {new Date(gift.timestamp).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(gift.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
