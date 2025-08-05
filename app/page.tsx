"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, Gift, Users, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { PixQRCode } from "./components/pix-qr-code"

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

const giftOptions = [
  {
    id: 1,
    title: "Cafezinho dos Noivos",
    value: 25,
    description: "Para começar o dia com amor",
    image: "/placeholder.svg?height=120&width=120&text=☕",
  },
  {
    id: 2,
    title: "Jantar Romântico",
    value: 100,
    description: "Uma noite especial a dois",
    image: "/placeholder.svg?height=120&width=120&text=🍽️",
  },
  {
    id: 3,
    title: "Lua de Mel Básica",
    value: 250,
    description: "Ajuda com a viagem dos sonhos",
    image: "/placeholder.svg?height=120&width=120&text=🌙",
  },
  {
    id: 4,
    title: "Lua de Mel Premium",
    value: 500,
    description: "Para uma viagem inesquecível",
    image: "/placeholder.svg?height=120&width=120&text=✈️",
  },
  {
    id: 5,
    title: "Casa dos Sonhos",
    value: 1000,
    description: "Construindo o futuro juntos",
    image: "/placeholder.svg?height=120&width=120&text=🏠",
  },
  {
    id: 6,
    title: "Presente Surpresa",
    value: 0,
    description: "Valor personalizado",
    image: "/placeholder.svg?height=120&width=120&text=🎁",
  },
]

export default function WeddingInvitation() {
  const [confirmDrawerOpen, setConfirmDrawerOpen] = useState(false)
  const [giftDrawerOpen, setGiftDrawerOpen] = useState(false)
  const [locationExpanded, setLocationExpanded] = useState(false)
  const [nameDialogOpen, setNameDialogOpen] = useState(false)

  // Form states
  const [guestName, setGuestName] = useState("")
  const [attendance, setAttendance] = useState<"yes" | "no" | "">("")
  const [selectedGift, setSelectedGift] = useState<(typeof giftOptions)[0] | null>(null)
  const [customValue, setCustomValue] = useState("")
  const [giftMessage, setGiftMessage] = useState("")
  const [tempName, setTempName] = useState("")

  // Storage states
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [hasSentMessage, setHasSentMessage] = useState(false)
  const [storedGuestName, setStoredGuestName] = useState("")

  useEffect(() => {
    // Check localStorage on mount
    const confirmed = localStorage.getItem("wedding_confirmed")
    const messageSent = localStorage.getItem("wedding_message_sent")
    const savedName = localStorage.getItem("wedding_guest_name")

    setHasConfirmed(!!confirmed)
    setHasSentMessage(!!messageSent)
    setStoredGuestName(savedName || "")
  }, [])

  const handleConfirmAttendance = async () => {
    if (!guestName.trim() || !attendance) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e confirme sua presença.",
        variant: "destructive",
      })
      return
    }

    const response: GuestResponse = {
      name: guestName,
      attendance: attendance as "yes" | "no",
      timestamp: new Date().toISOString(),
    }

    try {
      // Send to spreadsheet
      await fetch("/api/save-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      })

      // Save to localStorage
      localStorage.setItem("wedding_confirmed", "true")
      localStorage.setItem("wedding_guest_name", guestName)
      setHasConfirmed(true)
      setStoredGuestName(guestName)

      if (attendance === "yes") {
        toast({
          title: "Que alegria! 🎉",
          description: "Ficamos muito felizes em saber que você estará conosco neste dia especial!",
        })
      } else {
        toast({
          title: "Sentimos muito 😔",
          description: "Entendemos perfeitamente. Obrigado por nos avisar!",
        })
      }

      setConfirmDrawerOpen(false)

      // Open gift drawer after confirmation
      setTimeout(() => {
        setGiftDrawerOpen(true)
      }, 1000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua resposta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleSendGiftMessage = async () => {
    if (!giftMessage.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Por favor, escreva uma mensagem para os noivos.",
        variant: "destructive",
      })
      return
    }

    let finalName = storedGuestName
    if (!finalName) {
      if (!tempName.trim()) {
        setNameDialogOpen(true)
        return
      }
      finalName = tempName
    }

    const message: GiftMessage = {
      name: finalName,
      message: giftMessage,
      giftType: selectedGift?.title || "Presente personalizado",
      giftValue: selectedGift?.id === 6 ? Number.parseInt(customValue) : selectedGift?.value,
      timestamp: new Date().toISOString(),
    }

    try {
      // Send to spreadsheet
      await fetch("/api/save-gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      })

      // Save to localStorage
      localStorage.setItem("wedding_message_sent", "true")
      setHasSentMessage(true)

      toast({
        title: "Mensagem enviada! 💕",
        description: "Muito obrigado pelo carinho e generosidade!",
      })

      setGiftDrawerOpen(false)
      setGiftMessage("")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const pixKey = "natalia.matheus@casamento.com"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-800 mb-2 font-serif">N&M</div>
          <h1 className="text-2xl font-elegant text-gray-700 mb-6">Natália e Matheus</h1>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-lg font-semibold text-gray-800">15 de Junho, 2024</span>
            </div>
            <p className="text-gray-600 mb-2">às 16:00h</p>
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 text-gray-600 mr-1" />
              <span className="text-sm text-gray-600">Igreja São José - Centro</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Confirm Attendance */}
          <Drawer open={confirmDrawerOpen} onOpenChange={setConfirmDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                className="w-full h-14 text-lg bg-gray-800 hover:bg-gray-900 text-white shadow-lg"
                disabled={hasConfirmed}
              >
                <Users className="mr-2 h-5 w-5" />
                {hasConfirmed ? "Presença Confirmada ✓" : "Confirmar Presença"}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Confirmar Presença</DrawerTitle>
                <DrawerDescription>Nos ajude a organizar melhor nosso grande dia!</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-6">
                <div>
                  <Label htmlFor="name">Nome dos Convidados *</Label>
                  <Input
                    id="name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Você irá comparecer? *</Label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance("no")}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        attendance === "no"
                          ? "bg-gray-100 border-gray-300 shadow-md"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">😔</div>
                      <div className="font-semibold text-gray-800 mb-1">Não poderei ir</div>
                      <div className="text-sm text-gray-600">Infelizmente não conseguirei comparecer</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance("yes")}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        attendance === "yes"
                          ? "bg-gray-800 border-gray-800 text-white shadow-md"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">🎉</div>
                      <div className={`font-semibold mb-1 ${attendance === "yes" ? "text-white" : "text-gray-800"}`}>
                        Estarei presente
                      </div>
                      <div className={`text-sm ${attendance === "yes" ? "text-gray-200" : "text-gray-600"}`}>
                        Confirmo minha presença no casamento
                      </div>
                    </button>
                  </div>

                  {attendance && (
                    <div
                      className={`p-3 rounded-lg text-center ${
                        attendance === "yes"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {attendance === "yes"
                        ? "Que alegria! Ficamos muito felizes em saber que você estará conosco! 🎉"
                        : "Sentimos muito, mas entendemos perfeitamente. Obrigado por nos avisar! 😔"}
                    </div>
                  )}
                </div>

                <Button onClick={handleConfirmAttendance} className="w-full bg-gray-800 hover:bg-gray-900">
                  Enviar Confirmação
                </Button>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Gift the Couple */}
          <Drawer open={giftDrawerOpen} onOpenChange={setGiftDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="w-full h-14 text-lg bg-gray-700 hover:bg-gray-800 text-white shadow-lg">
                <Gift className="mr-2 h-5 w-5" />
                Presentear os Noivos
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <DrawerTitle>Presentear os Noivos</DrawerTitle>
                <DrawerDescription>Sua generosidade nos ajudará a começar nossa nova vida juntos!</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {giftOptions.map((gift) => (
                      <Card
                        key={gift.id}
                        className={`cursor-pointer transition-all aspect-square ${
                          selectedGift?.id === gift.id ? "ring-2 ring-gray-800 bg-gray-50" : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedGift(gift)}
                      >
                        <CardContent className="p-3 flex flex-col items-center justify-center h-full text-center">
                          <img src={gift.image || "/placeholder.svg"} alt={gift.title} className="w-12 h-12 mb-2" />
                          <CardTitle className="text-xs font-semibold mb-1">{gift.title}</CardTitle>
                          {gift.id === 6 ? (
                            <div className="w-full">
                              <Input
                                type="number"
                                placeholder="Valor"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                                className="text-xs h-8"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          ) : (
                            <p className="font-bold text-gray-800 text-sm">R$ {gift.value}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedGift && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold mb-4 text-center">Dados para PIX</h3>
                      <div className="text-center mb-4">
                        <PixQRCode
                          pixKey={pixKey}
                          value={selectedGift.id === 6 ? Number.parseInt(customValue) || 0 : selectedGift.value}
                          description={selectedGift.title}
                        />
                        <p className="text-sm text-gray-600 mb-3 mt-2">
                          Valor: R$ {selectedGift.id === 6 ? customValue || "0" : selectedGift.value}
                        </p>
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                          <span className="font-mono truncate">{pixKey}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(pixKey)
                              toast({ title: "Chave PIX copiada!" })
                            }}
                          >
                            Copiar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="message">Mensagem para os noivos</Label>
                    <Textarea
                      id="message"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Escreva uma mensagem carinhosa..."
                      className="mt-1"
                      disabled={hasSentMessage}
                    />
                    {hasSentMessage && (
                      <p className="text-sm text-gray-500 mt-1">Você já enviou uma mensagem anteriormente.</p>
                    )}
                  </div>

                  <Button
                    onClick={handleSendGiftMessage}
                    className="w-full bg-gray-800 hover:bg-gray-900"
                    disabled={!selectedGift || hasSentMessage}
                  >
                    Enviar Presente e Mensagem
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Location */}
          <div className="space-y-2">
            <Button
              onClick={() => setLocationExpanded(!locationExpanded)}
              className="w-full h-14 text-lg bg-gray-600 hover:bg-gray-700 text-white shadow-lg"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Ver Localização
            </Button>

            {locationExpanded && (
              <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.6333824!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2b2ed7f3a1%3A0x8adaaa3c2b4b4b4b!2sIgreja%20S%C3%A3o%20Jos%C3%A9!5e0!3m2!1spt!2sbr!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <Button
                  className="w-full bg-gray-600 hover:bg-gray-700"
                  onClick={() => {
                    const destination = "Igreja São José, Centro"
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
                      "_blank",
                    )
                  }}
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Leve-me lá
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <Heart className="h-4 w-4 inline mr-1" />
          Com amor, Natália & Matheus
        </div>
      </div>

      {/* Name Dialog */}
      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informe seu nome</DialogTitle>
            <DialogDescription>Para enviar a mensagem, precisamos saber quem você é.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="temp-name">Seu nome</Label>
              <Input
                id="temp-name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>
            <Button
              onClick={() => {
                if (tempName.trim()) {
                  setNameDialogOpen(false)
                  handleSendGiftMessage()
                }
              }}
              className="w-full bg-gray-800 hover:bg-gray-900"
            >
              Confirmar e Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
