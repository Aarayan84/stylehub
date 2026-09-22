import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(
      "stylehub_cart"
    );

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "stylehub_cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add product to cart
    const addToCart = (product, size, quantity = 1) => {
    setCartItems((previousItems) => {
        const existingItem = previousItems.find(
        (item) =>
            item.productId === product._id &&
            item.size === size
        );

        const stock = Number(product.stock || 0);

        if (existingItem) {
        const newQuantity =
            existingItem.quantity + quantity;

        return previousItems.map((item) =>
            item.productId === product._id &&
            item.size === size
            ? {
                ...item,
                quantity: Math.min(
                    newQuantity,
                    stock
                ),
                }
            : item
        );
        }

        const finalPrice =
        Number(product.price) -
        (Number(product.price) *
            Number(product.discount || 0)) /
            100;

        return [
        ...previousItems,
        {
            productId: product._id,
            title: product.title,
            image: product.image,
            size,
            quantity: Math.min(quantity, stock),
            price: Math.round(finalPrice),
            originalPrice: Number(product.price),
            stock,
        },
        ];
    });
 };
  // Remove item
  const removeFromCart = (productId, size) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size
          )
      )
    );
  };

  // Update quantity
  const updateQuantity = (
    productId,
    size,
    quantity
    ) => {
    const newQuantity = Number(quantity);

    if (
        !Number.isFinite(newQuantity) ||
        newQuantity <= 0
    ) {
        removeFromCart(productId, size);
        return;
    }

    setCartItems((previousItems) =>
        previousItems.map((item) => {
        if (
            item.productId === productId &&
            item.size === size
        ) {
            const stock = Number(item.stock || 0);

            const finalQuantity = Math.min(
            newQuantity,
            stock
            );

            if (finalQuantity <= 0) {
            return null;
            }

            return {
            ...item,
            quantity: finalQuantity,
            };
        }

        return item;
        }).filter(Boolean)
    );
    };
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total items
  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // Total price
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}