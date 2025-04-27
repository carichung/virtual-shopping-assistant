import React, { useState, useEffect, useRef } from "react";
import './App.css'; // Importing the CSS file
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase"; // Import Firestore & Auth
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home"; // Main chatbot page

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [products, setProducts] = useState([]);
  const chatBoxRef = useRef(null);
  const [user, setUser] = useState(null);

  //--------------------------------------------------------------------

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  //--------------------------------------------------------------------

  // ✅ Auto-scroll when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  //--------------------------------------------------------------------

  // ✅ Fetch products when the app loads
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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

  // ✅ The only `return` statement inside `App()`
  return (
    <Router>
      <Routes>
        {/* If user is logged in, go to chatbot, else go to login */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

