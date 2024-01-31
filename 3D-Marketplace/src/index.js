import { useState } from "react"
import { createRoot } from "react-dom/client"
import { useSharedState } from "./sharedState"
import "./styles.css"
import App from "./App"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SharedStateProvider } from "./sharedState"

function Overlay() {
  const { text, desc , price , user} = useSharedState();

  return (
    <>

      <div className="dot" />
      <p className="hovertext">{text}</p>
      <p className="pricetext">{price}</p>
      <p className="useraddress">✅ {user}</p>
      <p className="desc" id="desc">
      💡{desc}
      </p>
      <App />      
    </>
  );
}


createRoot(document.getElementById("root")).render(
  <SharedStateProvider>
    <Overlay />
  </SharedStateProvider>
)
