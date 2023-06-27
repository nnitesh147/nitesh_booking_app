import React, { useContext, useState , useEffect } from 'react'
import {differenceInCalendarDays} from "date-fns"
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from './main';

const BookingWidget = ({place}) => {
    
    const [checkIn, setcheckIn] = useState("");
    const [checkOut, setcheckOut] = useState("");
    const [numberOfGuests, setnumberOfGuests] = useState(1);
    const [name, setname] = useState("");
    const [phone, setphone] = useState("");
    const [redirect, setredirect] = useState("");
    const {user , isAuthentic , setisAuthentic} = useContext(Context);

    useEffect(() => {
      if(user){
        setname(user.name);
      }
    }, [user])
    

    let numOfNights = 0;
    if(checkIn && checkOut){
        numOfNights = differenceInCalendarDays(new Date(checkOut) , new Date(checkIn));
    }

    function check() {
      if(isAuthentic){
        bookThisPlace();
      }else{
        alert("Please login first");
        setredirect("/login");
      }
    }

    const bookThisPlace =   async () =>{
        const response = await axios.post("/bookings" , {checkIn , checkOut , numberOfGuests , name ,
            phone ,
            place:place._id,
            price:numOfNights*place.price,
        });
        const bookingId = response.data._id;
        setredirect(`/account/bookings/${bookingId}`)
    }


    if(redirect){
        return <Navigate to={redirect}/>
    }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
    <div className="text-2xl text-center">
      Price: ₹{place.price} / per night
    </div>
    <div className="border rounded-2xl mt-4">
      <div className="flex">
        <div className="py-3 px-4">
          <label>Check in:</label>
          <input type="date"
                 value={checkIn}
                 onChange={e => setcheckIn(e.target.value)}
            />
        </div>
        <div className="py-3 px-4 border-l">
          <label>Check out:</label>
          <input type="date" value={checkOut}
                 onChange={e => setcheckOut(e.target.value)}
            />
        </div>
      </div>
      <div className="py-3 px-4 border-t">
        <label>Number of guests:</label>
        <input type="number"
               value={numberOfGuests}
               onChange={e => setnumberOfGuests(e.target.value)}
            />
      </div>
      {numOfNights > 0 && (
        <div className='py-3 px-4 border-t'>
            <label>Your full Name:</label>
            <input type='text' value={name} placeholder='Name' onChange={(e)=> setname(e.target.value)}/>
            <label>Your Contact Number:</label>
            <input type='tel' value={phone} placeholder='XXXXXXXXX' onChange={(e)=> setphone(e.target.value)}/>
        </div>
      )}
    </div>
    <button  onClick={check} className="primary mt-4">
      Book this place
      {numOfNights > 0 && (
        <span> ₹{numOfNights * place.price}</span>
      )}
    </button>
  </div>
  )
}

export default BookingWidget