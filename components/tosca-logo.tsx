import { cn } from "@/lib/utils"
import Image from "next/image"

interface ToscaLogoProps {
  className?: string
}

export function ToscaLogo({ className }: ToscaLogoProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TOSCA_AI_removebg-preview-9RMszfr5iiGicaNpuyaZayXDtEioMF.png"
        alt="TOSCA AI Logo"
        width={200}
        height={200}
        className="w-full h-full object-contain"
        unoptimized
      />
    </div>
  )
}

