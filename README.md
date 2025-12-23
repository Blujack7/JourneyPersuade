# JourneyPersuade MVP

## Descripción
MVP de E-commerce destinado a reducir el abandono de carritos mediante IA proactiva.

## Requisitos
- **Opción A (Recomendada si tienes Docker)**: Docker Desktop.
- **Opción B (Manual)**: Python 3.10+ y Node.js 18+.

## Opción A: Ejecutar con Docker

1. Abre una terminal.
2. Ejecuta:
   ```bash
   docker compose up --build
   ```

## Opción B: Ejecución Manual (Sin Docker)

Si no tienes Docker instalado, sigue estos pasos:

### 1. Iniciar Backend (FastAPI)
Abre una terminal en `backend/`:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*El backend estará en http://localhost:8000/docs*

### 2. Iniciar Frontend (Next.js)
Abre **otra** terminal en `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
*La tienda estará en http://localhost:3000*

## Funcionalidades
- **Tienda**: Catálogo de productos con diseño premium.
- **AI Chatbot**: Widget flotante para asistencia.
- **Carrito Inteligente**: Mensajes persuasivos basados en el contenido del carrito.
- **Recomendaciones**: Sugerencias automáticas en el carrito.

## Despliegue en Servidor

Esta aplicación está preparada para ser desplegada en un servidor. Sigue estos pasos clave:

### 1. Variables de Entorno
Crea un archivo `.env` en el servidor (o configura las variables en tu plataforma cloud) con la URL de tu backend:
```env
NEXT_PUBLIC_API_URL=https://tu-backend-url.com
```

### 2. Docker (Opción Recomendada)
Puedes levantar todo el sistema usando Docker Compose:
```bash
docker-compose up -d --build
```

### 3. Recomendaciones por Plataforma
- **Frontend**: Utiliza Vercel para mayor facilidad.
- **Backend**: Utiliza Render o una VPS con Docker.
