import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase"; // Import Firebase & Firestore
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import styles

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [products, setProducts] = useState([]);
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Redirect user to login if not authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      let productList = [];
      querySnapshot.forEach((doc) => {
        productList.push(doc.data());
      });
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  // ✅ Fetch specific product category
  const fetchProductList = async (category) => {
    const querySnapshot = await getDocs(collection(db, "products"));
    let productList = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().category.toLowerCase() === category) {
        productList.push(`${doc.data().name} ($${doc.data().price})`);
      }
    });

    return productList.length > 0
      ? `✨ I found **${productList.length} amazing ${category} products!** Here are some of my top picks:\n\n${productList.join("\n")}`
      : "Oops! I couldn't find anything for that. Want me to check another category? 😊";
  };

  // ✅ Handle user messages
  const sendMessage = async () => {
    if (userInput.trim()) {
      const newMessages = [...messages, { text: userInput, fromUser: true }];
      setMessages(newMessages);

      let botResponse = "I'm your virtual assistant. How can I help you? 😊";

      if (userInput.toLowerCase().includes("eyeliner")) {
        botResponse = await fetchProductList("eyeliner");
      } else if (userInput.toLowerCase().includes("lipstick")) {
        botResponse = await fetchProductList("lipstick");
      } else if (userInput.toLowerCase().includes("recommend")) {
        botResponse = "I'd love to recommend something! 💖 What’s your **budget**?";
      } else if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
        botResponse = "Hey gorgeous! 💕 How can I assist you today?";
      } else {
        botResponse = "That's interesting! Could you tell me more about what you're looking for? 🤔";
      }

      setTimeout(() => {
        setMessages([...newMessages, { text: botResponse, fromUser: false }]);
      }, 1000);

      setUserInput("");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Virtual Shopping Assistant</h1>
        <div className="chat-container">
          <div className="chat-box" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.fromUser ? "user-message" : "bot-message"}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
