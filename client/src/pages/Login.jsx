import React, { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { Context } from '../main';

const login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [redirect, setredirect] = useState(false);
  const {user , setuser , setisAuthentic} = useContext(Context);

  const handleloginsubmit = async(e)=>{
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "/login",
        {
          email,
          password,
        },
      );
      alert("Login Successfull");
      setisAuthentic(true);
      setredirect(true);
      setuser(data);
    } catch (error) {
      alert(error.response.data.message);
      setuser(null);
      setisAuthentic(false);
    }
  }
  if(redirect){
    return <Navigate to={"/"}/>
  }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Login</h1>
        <form className='max-w-md mx-auto' onSubmit={handleloginsubmit}>
            <input
             type='email'
             placeholder="your@email.com"
             value={email}
             required
             onChange={(e)=>setemail(e.target.value)}
            />
            <input 
            type='password' 
            placeholder="Password"
            value={password}
            required
            onChange={(e)=>setpassword(e.target.value)}
            />
            <button className='primary'>Login</button>
            <div className='text-center py-2 text-gray-500'>Don't have an account yet?  <Link className='underline text-black' to={"/register"}>Register Now</Link>
            </div>
        </form>
        </div>
    </div>
  )
}

export default login