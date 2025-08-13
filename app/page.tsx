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
    title: "Só pra dizer que não dei nada",
    value: 200,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRuPYY-Q5V_55h2P5bua8my8e9A1qU5DHRjw&s",
  },
  {
    id: 2,
    title: "Cooktop de última geração",
    value: 250,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsQB6_4rEcy5az5PZHl34oqRtjnCmwnzSPfw&s",
  },
  {
    id: 3,
    title: "Taxa para a noiva jogar o buquê na sua direção",
    value: 300,
    image: "https://live.staticflickr.com/3569/3770416496_9fd49c0d83_b.jpg",
  },
  {
    id: 4,
    title: "Maquiagem da noiva",
    value: 350,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsBF4tjIhg8P_TcMfln4iCGIotlhARuhABSQ&s",
  },
  {
    id: 5,
    title: "Prioridade na fila do buffet",
    value: 400,
    image: "https://letseat.com.br/uploads/8227904a26a0dea282186766e6a63cc2.jpg",
  },
  {
    id: 6,
    title: "Ser o nosso convidado favorito",
    value: 450,
    image: "https://i.pinimg.com/736x/3f/78/2b/3f782bab2796dcf96f2c9cba48684658.jpg",
  },
  {
    id: 7,
    title: "Ajuda com os boletos do casamento",
    value: 500,
    image: "https://i.pinimg.com/564x/4e/3e/70/4e3e70f0d01a5f8134822cc108397256.jpg",
  },
  {
    id: 8,
    title: "Taxa para a noiva NÃO jogar o buquê para a sua namorada",
    value: 550,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQysPX2gbw0Q2lumxVHFsq5UhULe05IHgWxDA&s",
  },
  {
    id: 9,
    title: "Levar alguém que não foi convidado",
    value: 600,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlRkChqkKytMuPqNeCsHIkhmyP2b4Niqavg&s",
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
  
  //Payment
  const [pixPayload, setPixPayload] = useState('')

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
      await fetch("https://script.google.com/macros/s/AKfycbweGwCCeIHR1YwuhwLqn-Rw6agKL4O8OZeuuALNq04ecXEBNZ4ySL0g-GdKVbM9OxdI/exec", {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(response),
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        }
      })
      .then(response => response.json())
      .then(data => console.log("Resposta:", data))
      .catch(error => console.error("Erro:", error));

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

  const pixKey = "nataliamendonsa662@gmail.com"

  return (
    <div className="min-h-screen bg-[url(/paper-texture.jpg)]">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gray-800 mb-2 font-serif">N&M</div>
          <h1 className="text-2xl font-elegant text-gray-700 mb-6">Natália e Matheus</h1>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <span className="text-lg font-semibold text-[#696D40]">8 de novembro, 2025</span>
            </div>
            <p className="text-[#696D40] mb-2">às 16:00h</p>
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 text-[#696D40] mr-1" />
              <span className="text-sm text-[#696D40]">Bella Flora Casa de Festas</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-sm text-[#696D40]">R. Sergipe, 47 - flores, Manaus - AM</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Confirm Attendance */}
          <Drawer open={confirmDrawerOpen} onOpenChange={setConfirmDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                className="w-full h-14 text-lg bg-[#696D40] hover:bg-[#A1A08E] text-white shadow-lg"
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
                          ? "bg-[#696D40] border-gray-[#696D40] text-white shadow-md"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`font-semibold mb-1 ${attendance === "no" ? "text-white" : "text-gray-800"}`}>
                        Não poderei ir
                      </div>
                      <div className={`text-sm ${attendance === "no" ? "text-gray-200" : "text-gray-600"}`}>
                        Infelizmente não conseguirei comparecer
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance("yes")}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        attendance === "yes"
                          ? "bg-[#696D40] border-gray-[#696D40] text-white shadow-md"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
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
                        ? "Que alegria! Ficamos muito felizes em saber que você estará conosco!"
                        : "Sentimos muito, mas entendemos perfeitamente. Obrigado por nos avisar!"}
                    </div>
                  )}
                </div>

                <Button onClick={handleConfirmAttendance} className="w-full bg-[#696D40] hover:bg-[#A1A08E]">
                  Enviar Confirmação
                </Button>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Gift the Couple */}
          <Drawer open={giftDrawerOpen} onOpenChange={setGiftDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="w-full h-14 text-lg bg-[#696D40] hover:bg-[#A1A08E] text-white shadow-lg">
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
                          selectedGift?.id === gift.id ? "ring-2 ring-[#696D40] bg-gray-50" : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedGift(gift)}
                      >
                        <CardContent className="p-3 flex flex-col items-center justify-center h-full text-center">
                          <img src={gift.image || "/placeholder.svg"} alt={gift.title} className="w-24 h-24 mb-2 object-cover" />
                          <CardTitle className="text-xs font-semibold mb-1">{gift.title}</CardTitle>
                          {/* Remove custom gift */}
                          {gift.id === giftOptions.length + 1 ? (
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
                          setPixPayload={setPixPayload}
                        />
                        <p className="text-sm text-gray-600 mb-3 mt-2">
                          Valor: R$ {selectedGift.id === 6 ? customValue || "0" : selectedGift.value}
                        </p>
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                          <span className="font-mono truncate">{pixPayload}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(pixPayload)
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
                    className="w-full bg-[#696D40] hover:bg-[#A1A08E]"
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
              className="w-full h-14 text-lg bg-[#696D40] hover:bg-[#A1A08E] text-white shadow-lg"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Ver Localização
            </Button>

            {locationExpanded && (
              <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5613.946143139309!2d-60.01756382609123!3d-3.0660744993271214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926c1a7d33917857%3A0x2f933173e2d8023f!2sBELLA%20FLORA%20Casa%20de%20Festas!5e0!3m2!1spt-BR!2sbr!4v1754963098804!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                </div>

                <Button
                  className="w-full bg-[#696D40] hover:bg-[#A1A08E]"
                  onClick={() => {
                    const destination = "Bella Flora Casa de Festas. R. Sergipe, 47 - flores, Manaus - AM"
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
                      "_blank",
                    )
                  }}
                >
                  <Navigation className="h-4 w-4" />
                  Leve-me lá
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-[#696D40] text-sm">
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
              className="w-full bg-[#696D40] hover:bg-[#A1A08E]"
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
