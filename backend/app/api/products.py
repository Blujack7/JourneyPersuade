from fastapi import APIRouter
import json
import os

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), '../../data/products.json')

def load_products():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

@router.get("/")
def get_products():
    return load_products()

@router.get("/{product_id}")
def get_product(product_id: int):
    products = load_products()
    for product in products:
        if product['id'] == product_id:
            return product
    return {"error": "Product not found"}
