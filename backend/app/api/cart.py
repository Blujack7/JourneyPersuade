from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    product_id: int
    quantity: int
    price: float

class CartAnalysis(BaseModel):
    cart_total: float
    items: List[CartItem]
    
router = APIRouter()

@router.post("/analyze")
def analyze_cart(cart: CartAnalysis):
    """
    Analyze the cart and return proactive persuasion messages.
    """
    messages = []
    
    # Logic 1: Free Shipping Threshold (e.g. $1000)
    if cart.cart_total < 1000:
        remaining = 1000 - cart.cart_total
        messages.append(f"¡Agrega ${remaining:.2f} más para ENVÍO PREMIUM GRATIS!")
    else:
        messages.append("¡Has desbloqueado ENVÍO GRATIS!")
        
    # Logic 2: Bulk Discount Nudge
    item_count = sum(item.quantity for item in cart.items)
    if item_count > 0 and item_count < 3:
        messages.append("Compra 3 artículos para obtener un cupón de 10% de descuento aplicado automáticamente.")
    
    # Logic 3: High Value Reassurance (Trust signal)
    if cart.cart_total > 1500:
        messages.append("Tu pedido está protegido por nuestra Garantía de Devolución de 30 días.")
        
    return {"persuasion_messages": messages}
