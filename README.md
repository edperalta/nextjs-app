# nextjs-app

Interfaz de chat con un agente usando un prompt predefinido.

## 🚀 Características

- **Interfaz de chat moderna y responsive** con diseño limpio
- **Prompt predefinido** para el agente: "Eres un asistente amigable y útil. Tu objetivo es ayudar a los usuarios con sus preguntas y proporcionarles información precisa y útil. Responde siempre en español de manera clara y concisa."
- **Componentes modulares** (ChatInterface, ChatMessage, ChatInput)
- **Timestamps** en cada mensaje
- **Indicador de escritura animado** cuando el agente está respondiendo
- **Auto-scroll** automático a nuevos mensajes

## 🛠️ Tecnologías

- [Next.js 16](https://nextjs.org/) con App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🎯 Uso

1. Abre tu navegador en `http://localhost:3000`
2. Escribe tu mensaje en el campo de entrada
3. Presiona "Enviar" o Enter para enviar el mensaje
4. El agente responderá basándose en el prompt predefinido

## 📸 Screenshots

### Interfaz inicial
![Interfaz inicial](https://github.com/user-attachments/assets/7d5e8c10-28f2-49ca-9444-53844ddea9bf)

### Chat en acción
![Chat con mensajes](https://github.com/user-attachments/assets/b9584682-a617-4ce3-b2fe-2b2a26211b0c)

## 🔮 Próximos pasos

Actualmente, la respuesta del agente está simulada. Para integrar con una API de IA real:

1. Agregar variables de entorno para la clave API
2. Implementar un endpoint API en `/app/api/chat/route.ts`
3. Integrar con servicios como:
   - [OpenAI API](https://platform.openai.com/)
   - [Anthropic Claude](https://www.anthropic.com/)
   - [Google Gemini](https://ai.google.dev/)
   - O cualquier otro proveedor de LLM

## 📄 Licencia

ISC
