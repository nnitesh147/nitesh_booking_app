import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { useState , useEffect } from 'react'
import axios from 'axios'


export const Context = createContext({isAuthentic:false});

const AppWrapper = ()=>{

  const [user , setuser] = useState(null);
  const [ready, setready] = useState(false);
  const [isAuthentic , setisAuthentic] = useState(false);

useEffect(() => {
    setready(false);
    axios.get("/profile" , {withCredentials:true}).then(({data})=>{
    setisAuthentic(true),
    setuser(data),
    setready(true);
    }).catch((error) =>{
      setisAuthentic(false),
      setuser(null),
      setready(true);
    })
}, [])
  
  return(
    <Context.Provider
  value={{
    user,
    setuser,
    ready,
    setready,
    isAuthentic , 
    setisAuthentic,
  }}
  >
    <App />
  </Context.Provider>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AppWrapper/>
    </BrowserRouter>
  </React.StrictMode>,
)
