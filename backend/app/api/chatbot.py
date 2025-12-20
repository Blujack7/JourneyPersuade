from fastapi import APIRouter
from pydantic import BaseModel

class ChatMessage(BaseModel):
    message: str

router = APIRouter()

@router.post("/message")
def chat_response(chat: ChatMessage):
    msg = chat.message.lower()
    
    # Default response
    response = "Lo siento, soy un bot de demostración. Intenta preguntar sobre 'envio', 'devolucion', 'descuento' o 'ayuda'."
    
    # Simple Keyword Matching Intents
    if "envio" in msg or "entrega" in msg:
        response = "¡Ofrecemos envío GRATIS en pedidos superiores a $1000! De lo contrario, son $15 fijos. La entrega tarda 3-5 días hábiles."
    elif "devolucion" in msg or "reembolso" in msg or "retorno" in msg:
        response = "Nuestra Garantía de devolución de 30 días te permite devolver cualquier artículo en su condición original."
    elif "descuento" in msg or "oferta" in msg or "cupon" in msg:
        response = "¡Usa el código 'JOURNEY20' para un 20% de descuento en tu primer pedido hoy!"
    elif "hola" in msg or "buenos" in msg:
        response = "¡Hola! Soy tu asistente de JourneyPersuade. ¿En qué puedo ayudarte a comprar hoy?"
    elif "ayuda" in msg:
        response = "Puedo ayudarte con información de envíos, políticas de devolución y descuentos actuales. ¡Solo pregunta!"
    elif "gracias" in msg:
        response = "¡De nada! Felices compras."
        
    return {"response": response}
