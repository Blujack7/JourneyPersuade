from fastapi import APIRouter, Body
from typing import List
import os
import json
import random

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), '../../data/products.json')

def load_products():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

@router.post("/recommend")
def recommend_products(cart_items: List[int] = Body(...)):
    """
    Recommend products based on the categories of items in the cart.
    If cart is empty, recommend popular items (random for now).
    """
    all_products = load_products()
    products_map = {p['id']: p for p in all_products}
    
    # Identify categories in cart
    cart_categories = set()
    for item_id in cart_items:
        if item_id in products_map:
            cart_categories.add(products_map[item_id].get('category'))
            
    recommendations = []
    
    # Simple Content-Based Filtering: Recommend same category
    if cart_categories:
        for product in all_products:
            if product['id'] not in cart_items and product.get('category') in cart_categories:
                recommendations.append(product)
    
    # Fallback or additional filling
    if len(recommendations) < 3:
        for product in all_products:
            if product['id'] not in cart_items and product not in recommendations:
                recommendations.append(product)
                
    # Shuffle and limit
    random.shuffle(recommendations)
    return {"recommended_products": recommendations[:3]}
