"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123" // Default fall back only for dev
const COOKIE_NAME = "site_admin_token"

export async function login(formData: FormData) {
    const password = formData.get("password") as string
    if (password === ADMIN_PASSWORD) {
        (await cookies()).set(COOKIE_NAME, "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })
        return { success: true }
    }
    return { success: false, error: "Invalid password" }
}

export async function logout() {
    (await cookies()).delete(COOKIE_NAME)
    redirect("/")
}

export async function checkAuth() {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)
    return token?.value === "authenticated"
}
