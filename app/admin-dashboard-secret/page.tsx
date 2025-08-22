"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Users, Gift, Calendar, Loader2 } from "lucide-react"

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

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin w-12 h-12 mb-4" />
        <h1 className="text-xl font-semibold text-gray-700">Carregando...</h1>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [responses, setResponses] = useState<GuestResponse[]>([])
  const [gifts, setGifts] = useState<GiftMessage[]>([])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resResponses = await fetch("https://script.google.com/macros/s/AKfycbzEB8Fow4fh4-O2QgCnivMu2L4k3DGHFQ2I-QjH1l54tjQSRV_I84OWNc7u6_dzl_Pa/exec");
        const dataResponses = await resResponses.json();
        setResponses(dataResponses);

        const resGifts = await fetch("https://script.google.com/macros/s/AKfycbyZI7BcooPZynELPmk3hMoz1UhrYuIN3EgE3iXVEcWhQg31P5TsuOu8pvY2k3Z8fUULNA/exec");
        const dataGifts = await resGifts.json();
        setGifts(dataGifts);
      } catch (error) {
        console.error('Something went wrong: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const confirmedAdultGuests = responses.filter((r) => r.attendance === "yes").flatMap(r => JSON.parse(r.name).adults).length
  const confirmedChildrenGuests = responses.filter((r) => r.attendance === "yes").flatMap(r => JSON.parse(r.name).children).length

  const declinedAdultGuests = responses.filter((r) => r.attendance === "no").flatMap(r => JSON.parse(r.name).adults).length
  const declinedChildrenGuests = responses.filter((r) => r.attendance === "no").flatMap(r => JSON.parse(r.name).children).length

  const confirmedInvites = responses.filter((r) => r.attendance === "yes")
  const declinedInvites = responses.filter((r) => r.attendance === "no")
  // const totalGiftValue = gifts.reduce((sum, gift) => sum + (gift.giftValue || 0), 0)

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-gray-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Dashboard do Casamento</h1>
          </div>
          <p className="text-gray-600">Natália & Matheus - 8 de novembro, 2025</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Pessoas: {confirmedAdultGuests + confirmedChildrenGuests + declinedAdultGuests + declinedChildrenGuests}</div>
              <div className="text-2xl font-bold">Convites: {responses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Pessoas: {confirmedAdultGuests + confirmedChildrenGuests}</div>
              <div className="text-2xl font-bold text-green-600">Convites: {confirmedInvites.length}</div>
              <div className="text-md font-bold text-green-600 mt-4">Adultos: {confirmedAdultGuests}</div>
              <span className="text-md font-bold text-green-600">Crianças: {confirmedChildrenGuests}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Comparecerão</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">Pessoas: {declinedAdultGuests + declinedChildrenGuests}</div>
              <div className="text-2xl font-bold text-red-600">Convites: {declinedInvites.length}</div>
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
              {responses.map((response, index) => {
                // aqui sim você pode declarar variáveis
                const namesObject = JSON.parse(response.name); // transforma string em objeto
                const adults = [
                  ...namesObject.adults
                ].join(", ");
                const children = [
                  ...namesObject.children
                ].join(", ");

                const date = new Date(response.timestamp);
                const formattedDate = date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
                const formattedHour = date.toLocaleTimeString("pt-BR", {
                  timeZone: "UTC",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{adults}</p>
                      <p className="font-medium">{children}</p>
                      <p className="text-sm text-gray-500">
                        {formattedDate} às {formattedHour}
                      </p>
                    </div>
                    <Badge
                      variant={
                        response.attendance === "yes" ? "default" : "destructive"
                      }
                    >
                      {response.attendance === "yes" ? "Confirmado" : "Não vai"}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Gift Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Presentes e Mensagens</CardTitle>
              <CardDescription>Mensagens carinhosas dos convidados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gifts.map((gift, index) => {
                // transforma string JSON em objeto
                let displayNames = "";
                try {
                  const namesObject = JSON.parse(gift.name);
                  displayNames = [
                    ...namesObject.adults,
                    ...namesObject.children,
                  ].join(", ");
                } catch {
                  // se não for JSON válido, mostra direto o valor
                  displayNames = gift.name;
                }

                const date = new Date(gift.timestamp);
                const formattedDate = date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
                const formattedHour = date.toLocaleTimeString("pt-BR", {
                  timeZone: "UTC",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{displayNames}</p>
                      {/* <Badge variant="outline">R$ {gift.giftValue}</Badge> */}
                    </div>
                    <p className="text-sm text-gray-600">{gift.giftType}</p>
                    <Separator />
                    <p className="text-sm italic">"{gift.message}"</p>
                    <p className="text-xs text-gray-500">
                      {formattedDate} às {formattedHour}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
