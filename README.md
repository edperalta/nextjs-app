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

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🐳 Docker & Base de Datos

Este proyecto incluye configuración completa de Docker para MySQL:

### Iniciar Base de Datos MySQL

```bash
# Iniciar solo MySQL
npm run docker:db:up

# Iniciar MySQL + phpMyAdmin
npm run docker:up

# Ver logs de MySQL
npm run docker:db:logs

# Detener servicios
npm run docker:db:down

# Limpiar volúmenes y contenedores
npm run docker:clean
```

### Acceso a Servicios

- **MySQL**: `localhost:3306`
  - Usuario: `nextjs_user`
  - Contraseña: `nextjs_password`
  - Base de datos: `nextjs_db`
- **phpMyAdmin**: `http://localhost:8080`

### Scripts de Inicialización

Coloca archivos `.sql` en `docker/mysql/init/` para ejecutarlos automáticamente al iniciar el contenedor por primera vez.

### Variables de Entorno

Configura tus credenciales en el archivo `.env`:

```env
DATABASE_URL="mysql://nextjs_user:nextjs_password@localhost:3306/nextjs_db"
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=nextjs_db
MYSQL_USER=nextjs_user
MYSQL_PASSWORD=nextjs_password
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

Para integrar con una API de IA real:

1. Agregar variables de entorno para la clave API
2. Implementar un endpoint API en `/app/api/chat/route.ts`
3. Integrar con servicios como OpenAI, Anthropic Claude, o Google Gemini

## 🗄️ Database & Prisma

El proyecto incluye Prisma ORM configurado con MySQL:

### Ver datos en Prisma Studio

```bash
npm run prisma:studio
# Abre http://localhost:5555
```

### Comandos Prisma disponibles

```bash
npm run prisma:generate      # Generar cliente Prisma
npm run prisma:migrate       # Crear nueva migración
npm run prisma:seed          # Poblar base de datos
npm run db:push              # Push schema sin migración
```

Ver [prisma/README.md](prisma/README.md) para documentación completa.

## 📁 Arquitectura

Arquitectura basada en **Controller-Service-Repository Pattern**:

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Controllers)
│   └── [pages]/           # UI Pages
├── components/            # React Components
│   └── ui/               # shadcn/ui components
└── lib/
    ├── controllers/       # HTTP Controllers
    ├── services/         # Business Logic
    ├── repositories/     # Data Access Layer (Prisma)
    ├── dto/             # Data Transfer Objects (Zod)
    ├── types/           # TypeScript Types
    ├── db/              # Database Connection
    └── utils/           # Utilities & Helpers
```

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para más detalles.

## 📄 Licencia

ISC
