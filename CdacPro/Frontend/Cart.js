import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({ setCartCount }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(
        `http://localhost:5050/customer/getCartByUserId/${userId}`,
        config
      );

      const data = response.data || [];
      setCartItems(Array.isArray(data) ? data : []);
      setCartCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const total = cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [cartItems]);

  const handleDeleteProduct = async (productId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
        params: { userId, productId },
      };

      const response = await axios.delete(
        `http://localhost:5050/customer/removeProductFromCart`,
        config
      );

      if (response.status === 200) {
        const updatedCart = cartItems.filter(
          (item) => item.product.productId !== productId
        );
        setCartItems(updatedCart);
        setCartCount(updatedCart.length);
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleProceedToPayment = () => {
    const products = cartItems.map((item) => ({
      productId: item.product.productId,
      quantity: item.quantity,
    }));

    navigate("/payment", {
      state: { products, totalPrice, userId },
    });
  };

  return (
    <div className="cart-theme">
      <div className="cart-wrapper">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <div key={item.product.productId} className="cart-item-card">
                <img
                  src={
                    item.product.productImage
                      ? `data:image/png;base64,${item.product.productImage}`
                      : process.env.PUBLIC_URL + "/images/product.png"
                  }
                  alt={item.product.productName}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h4>{item.product.productName}</h4>
                  <p className="seller">Seller: Grocefy</p>

                  <div className="price-info">
                    <span className="original-price">₹{item.product.originalPrice}</span>
                    <span className="discounted-price">₹{item.product.price}</span>
                  </div>

                  <p className="quantity">Quantity: {item.quantity}</p>

                  <button
                    className="remove-btn"
                    onClick={() => handleDeleteProduct(item.product.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-total-box">
              <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
              <button className="pay-btn" onClick={handleProceedToPayment}>
                Proceed to Payment
              </button>
            </div>
          </>
        ) : (
          <p className="empty-cart-msg">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Cart;
