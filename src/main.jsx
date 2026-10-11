import { StrictMode, createContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GlobalContextProvider from "./contextProviders/GlobalContextProvider"

const AppContext = createContext({
  allData: localStorage.getItem("invData")
})

createRoot(document.querySelector("body")).render(
  <StrictMode>
    <GlobalContextProvider>
      <App />
    </GlobalContextProvider>
  </StrictMode>,
)
