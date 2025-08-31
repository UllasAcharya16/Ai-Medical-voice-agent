"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { DoctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall } from 'lucide-react';
import Image from 'next/image'
import { Button } from '@/components/ui/button';

type sessionDetails={
  id:number,
  notes:string,
  sessionId:string,
  report:JSON,
  selectedDoctor:DoctorAgent,
  createdOn:string
}

function MedicalVoiceAgent() {
   const {sessionid}= useParams();
   const [sessionDetails,setsessionDetails]=useState<sessionDetails>();

   useEffect(()=> {
    
    sessionid&&GetsessionDetails();

   },[sessionid])

   const GetsessionDetails=async()=>{
    
       const result = await axios.get('/api/session-chat?sessionId='+sessionid)
       console.log(result.data);
       setsessionDetails(result.data);
   }
  return (
   
    <div className='p-5 border rounded-3xl bg-secondary'>
     <div className='flex justify-between items-center'>
       <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center '>  <Circle className='h-4 w-4'/> Not Connected </h2>
       <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
     </div>

     <div className='flex items-center flex-col mt-10 '>

      {sessionDetails&& <Image src={sessionDetails?.selectedDoctor?.image}
       alt={sessionDetails?.selectedDoctor?.specialist??''}
       width={120}
       height={120} 
       className='h-[100px] w-[100px] object-cover border rounded-full'/>}
      <h2 className='mt-2 text-lg '>{sessionDetails?.selectedDoctor?.specialist}</h2>
      <p className='text-sm text-gray-400'>Ai Medical Voice Agent</p>

      <div className='mt-30'>

        <h2 className='text-gray-400'>Assistant msg</h2>
        <h2 className='text-lg'>User msg</h2>
      
      </div>

      <Button className='mt-20'><PhoneCall/> Start Call</Button>

     </div>
    </div>
  )
}

export default MedicalVoiceAgent
