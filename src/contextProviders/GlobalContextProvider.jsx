import { createContext, useEffect, useState } from "react"
import data from "../invData.json"

export const GlobalContext = createContext({
    invData: {},
    updateInvData: ()=>{}
});

export default function GlobalContextProvider({children}) 
{
  const [invData, setInvData] = useState({})

  useEffect(() => {
    // localStorage.setItem("invData", JSON.stringify(data))
    const storedData = localStorage.getItem("invData")
    if(storedData) setInvData (JSON.parse(storedData));
    else localStorage.setItem("invData", "{}")

  }, [])

  function updateInvData(newData) {
    localStorage.setItem("invData", JSON.stringify(newData));
    setInvData(newData);
    return true; 
  }
  return (
    <GlobalContext.Provider
      value={{
        invData,
        updateInvData
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
