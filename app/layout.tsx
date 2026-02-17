import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat con Agente",
  description: "Interfaz de chat con un agente usando un prompt predefinido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
