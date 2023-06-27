import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react';
import axios from "axios"

const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [redirect, setredirect] = useState("");
  const registerUser = async (e)=>{
    e.preventDefault();
    try {
      await axios.post("/register" , {
        name,
        email, 
        password,
      });
      alert("Registration SuccessFull! Please login!");
      setredirect("/login");
    } catch (error) {
      alert("Registration failed! Please try again!");
    }
  }
  if(redirect){
    return <Navigate to={redirect}/>
  }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Register</h1>
        <form className='max-w-md mx-auto' onSubmit={registerUser}>
            <input 
             type='text'
             placeholder="Name"
             value={name}
             required
             onChange={(e)=>setname(e.target.value)}
             />
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
            <button className='primary'>Register</button>
            <div className='text-center py-2 text-gray-500'>Already a member?  <Link className='underline text-black' to={"/login"}>Login Now</Link>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Register