"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useI18n } from "@/context/i18n-context"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function AuthDialog({ isOpen, onClose, message }: AuthDialogProps) {
  const router = useRouter()
  const { t } = useI18n()

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>{t("auth-required")}</DialogTitle>
          <DialogDescription>{message || t("auth-message")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            {t("continue-anyway")}
          </Button>
          <Button onClick={handleLogin}>{t("go-to-login")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

