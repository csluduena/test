'use client'

import { useState } from 'react'
import { io } from 'socket.io-client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from 'lucide-react'

// Inicializar socket fuera del componente
const socket = io('https://db.estudiobeguier.com', {
    reconnectionDelayMax: 10000,
    withCredentials: true
});

export default function NameForm() {
    const [name, setName] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setStatus('loading')

        socket.emit('writeProject', {
            project: 'prueba',
            data: {
                name: name.trim(),
                timestamp: new Date().toISOString()
            }
        })
    }

    // Escuchar la confirmación de escritura
    socket.on('writeSuccess', () => {
        setStatus('success')
        setMessage('¡Nombre guardado correctamente!')
        setName('')
    })

    // Manejar errores
    socket.on('error', ({ message }) => {
        setStatus('error')
        setMessage(message || 'Error al guardar el nombre')
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">¿Cuál es tu nombre?</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Escribe tu nombre aquí"
                                required
                                className="w-full"
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={status === 'loading' || !name.trim()}
                        className="w-full"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : 'Guardar'}
                    </Button>

                    {(status === 'success' || status === 'error') && (
                        <Alert variant={status === 'success' ? "default" : "destructive"}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

