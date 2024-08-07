import { useEffect, useState } from "react";
import { useMemo } from 'react';
import { db } from "../data/db";

export const useCart = () => {
  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  const [data, setdata] = useState([]);
  const [cart, setCart] = useState(initialCart);

  const addToCart = (item) => {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id);
    if (itemExists >= 0 ) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity ++;
      setCart(updatedCart); 
    } else {
      item.quantity = 1;
      setCart(prev => [...prev, item]);
    }

    saveLocalStorage();
  }

  const removeFromCard = (id) => {
    setCart(prev => prev.filter(guitar => guitar.id != id));
  }

  const increaseQuantity = (id) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity <= MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item;
    });

    setCart(updatedCart);
  }

  const decreaseFromCart = (id) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item;
    })

    setCart(updatedCart);
  }

  const clearCart = () => {
    setCart([]);
  }

  const saveLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  useEffect(() => {
    setdata(db)
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart])
  
  
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCard,
    increaseQuantity,
    decreaseFromCart,
    clearCart,
    isEmpty,
    cartTotal
  }
}