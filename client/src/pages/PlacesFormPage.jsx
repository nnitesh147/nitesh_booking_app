import React, { useEffect } from 'react'
import { useState } from 'react';
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks"
import AccountNav from './AccountNav';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

const PlacesFormPage = () => {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [redirect, setredirect] = useState(false);
    const [price, setprice] = useState(1000);

    useEffect(() => {
      if(!id){
        return;
      }
      axios.get("/places/"+id).then(response =>{
        const {data} = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setprice(data.price);
      });
    }, [id])
    


    function inputdescription(text){
        return (
          <p className='text-gray-500 text-sm'>{text}</p>
        );
      }
      function inputHeader(text){
        return (
          <h2 className='text-2xl mt-4'>{text}</h2>
        );
      }
      function preInput(header , description){
        return(
          <>
          {inputHeader(header)}
          {inputdescription(description)}
          </>
        )
      }
      const savePlace = async(e)=>{
        e.preventDefault();
        const placeData = {title , address , addedPhotos , description ,perks
        , extraInfo , checkIn , checkOut , maxGuests , price};
        if(id){
          await axios.put("/places" , {id , ...placeData});
        }else{
          await axios.post("/places" , placeData);
        }
        setredirect(true);
      }
    
      if(redirect){
        return <Navigate to={"/account/places"}/>
      }

  return (
    <div>
        <AccountNav/>
    <form onSubmit={savePlace}>
      {preInput('Title' , 'Title for your place , should be short and catchy as in advertisement')}
      <input type='text' value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='Title , for example: My lovely apartment'/>
      {preInput('Address' , 'Address to this place')}
      <input type='text' 
       value={address} 
       onChange={(e)=>{setAddress(e.target.value)}} 
       placeholder='Address'/>
      {preInput('Photos' ,  'more = better')}
      <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
      {preInput('Description ' , 'Description of this place')}
      <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}}/>
      {preInput('Perks' , 'Select all the perks of your place')}
      <div className='gap-2 mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
       <Perks selected={perks} onChange={setPerks}/>
      </div>
      {preInput('Extra Info' , 'House rules , etc')}
      <textarea value={extraInfo} onChange={(e)=>{setExtraInfo(e.target.value)}}/>
      {preInput('Check In&Out times' , 'Add check in and out times , remeber to have some time window for cleaning the room when guest arrives.')}
      <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
        <div>
          <h3 className='mt-2 -mb-1'>Check in time</h3>
          <input value={checkIn}
           onChange={(e)=>{setCheckIn(e.target.value)}} 
           type='text' placeholder='14:00'/>
        </div>
        <div>
          <h3 className='mt-2 -mb-1'>Check out time</h3>
          <input value={checkOut}
           onChange={(e)=>{setCheckOut(e.target.value)}}
            type='text' placeholder='11:00'/>
        </div>
        <div>
          <h3 className='mt-2 -mb-1'>Max number of guests</h3>
          <input value={maxGuests}
           onChange={(e)=>{setMaxGuests(e.target.value)}}
            type='number'/>
        </div>
        <div>
          <h3 className='mt-2 -mb-1'>Price per night</h3>
          <input value={price}
           onChange={(e)=>{setprice(e.target.value)}}
            type='number'/>
        </div>
      </div>
      <button  className='primary my-4'>Save</button>
    </form>
  </div>
  )
}

export default PlacesFormPage