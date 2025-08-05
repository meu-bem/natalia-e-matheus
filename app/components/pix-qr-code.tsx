"use client"

import { useEffect, useRef } from "react"
import { payload } from "pix-payload"
import QRCode from "qrcode"

interface PixQRCodeProps {
  pixKey: string
  value: number
  description: string
}

export function PixQRCode({ pixKey, value, description }: PixQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Format the value to have 2 decimal places
    const formattedValue = value.toFixed(2)

    const data = {
      key: pixKey,
      name: "Mateus Santos Mendonca",
      city: "SAO PAULO",
      amount: formattedValue,
      transactionId: "PAY43VITRINE",
    }

    const pixPayload = payload(data)

    // Generate QR code
    QRCode.toCanvas(canvasRef.current, pixPayload, {
      width: 240,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
  }, [pixKey, value, description])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border p-2 rounded-lg" />
    </div>
  )
}
