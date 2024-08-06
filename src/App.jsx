import { Guitar } from "./components/Guitar"
import { Header } from "./components/Header"
import { db } from "./data/db";
import { useEffect, useState } from "react";

function App() {
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
  
  
  return (
    <>
      <Header cart={cart}
              removeFromCard={removeFromCard}
              increaseQuantity={increaseQuantity}
              decreaseFromCart={decreaseFromCart}
              clearCart={clearCart}
              />
    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {
            data.map(guitar => (
              <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart}/>
            ))
          }
        </div>
    </main>

    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
