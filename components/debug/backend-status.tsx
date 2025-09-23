"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'
import { API_CONFIG } from '@/lib/api/config'

interface BackendStatus {
  isOnline: boolean
  responseTime?: number
  error?: string
  timestamp?: string
}

export function BackendStatus() {
  const [status, setStatus] = useState<BackendStatus>({ isOnline: false })
  const [isChecking, setIsChecking] = useState(false)

  const checkBackendStatus = async () => {
    setIsChecking(true)
    const startTime = Date.now()
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        setStatus({
          isOnline: true,
          responseTime,
          timestamp: new Date().toLocaleTimeString('fr-FR'),
        })
      } else {
        setStatus({
          isOnline: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date().toLocaleTimeString('fr-FR'),
        })
      }
    } catch (error: any) {
      setStatus({
        isOnline: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString('fr-FR'),
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkBackendStatus()
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Statut du Backend
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={checkBackendStatus}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Vérification de la connectivité avec le backend Spring Boot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Statut:</span>
          <Badge variant={status.isOnline ? "default" : "destructive"}>
            {status.isOnline ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                En ligne
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Hors ligne
              </>
            )}
          </Badge>
        </div>

        {status.isOnline && status.responseTime && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Temps de réponse:</span>
            <span className="text-sm text-muted-foreground">
              {status.responseTime}ms
            </span>
          </div>
        )}

        {status.error && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Erreur:</span>
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {status.error}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">URL:</span>
          <span className="text-sm text-muted-foreground font-mono">
            {API_CONFIG.BASE_URL}
          </span>
        </div>

        {status.timestamp && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dernière vérification:</span>
            <span className="text-sm text-muted-foreground">
              {status.timestamp}
            </span>
          </div>
        )}

        <Button 
          onClick={checkBackendStatus} 
          disabled={isChecking}
          className="w-full"
          variant="outline"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Vérification...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Vérifier à nouveau
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
