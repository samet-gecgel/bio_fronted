"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminAPI } from "@/app/api";
import { useRouter } from "next/navigation";
import getRoleFromToken from "@/utils/getRoleFromTokens";

const adminLoginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin."),
  password: z.string().min(6, "Parola en az 6 karakter olmalıdır."),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setErrorMessage(null);
    try {
      const response = await adminAPI.login(data);
      if (response.data) {
        localStorage.setItem("token", response.data);
        const role = getRoleFromToken(response.data);
        if (role === "SuperAdmin") {
          router.push("/super-admin");
        } else if (role === "Admin") {
          router.push("/admin");
        } else {
          throw new Error("Bilinmeyen bir rol tespit edildi.");
        }
      }
    } catch (error: any) {
      if (error instanceof Error && error.message) {
        try {
          const parsedError = JSON.parse(error.message);

          if (parsedError.errors) {
            if (parsedError.errors.Password) {
              setErrorMessage("Parola en az 6 karakter olmalıdır.");
            } else if (parsedError.errors.Email) {
              setErrorMessage("Geçerli bir email adresi girin.");
            }
          } else if (parsedError.errorMessage) {
            setErrorMessage("Email veya parola hatalıdır.");
          } else {
            setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
          }
        } catch (parseError) {
          setErrorMessage("Email veya parola hatalıdır.");
        }
      } else {
        setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Admin Girişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email adresinizi girin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Şifre */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Şifrenizi girin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hata Mesajı */}
              {errorMessage && (
                <div className="text-sm text-red-500 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Giriş Butonu */}
              <Button type="submit" className="w-full">
                Giriş Yap
              </Button>
            </form>
          </Form>
          {/* Şifre Hatırlatma */}
          <div className="text-center mt-4">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Şifremi unuttum
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
