from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import products, recommendation, chatbot, cart

app = FastAPI(title="JourneyPersuade API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(cart.router, prefix="/api/cart", tags=["cart"])
app.include_router(recommendation.router, prefix="/api/recommend", tags=["recommendation"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])
from app.api import analytics
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {"message": "JourneyPersuade API is running"}
