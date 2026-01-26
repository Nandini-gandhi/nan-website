"use client"

import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const res = await login(formData)
        if (res.success) {
            router.push("/admin")
            router.refresh()
        } else {
            setError(res.error || "Login failed")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Enter password to manage posts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
