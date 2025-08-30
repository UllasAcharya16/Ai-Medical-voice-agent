"use client"
import { useParams } from 'next/navigation'
import React from 'react'

function MedicalVoiceAgent() {
   const {sessionid}= useParams();
   const GetsessionDetails=()=>{
    
   }
  return (
   
    <div>
     {sessionid}
    </div>
  )
}

export default MedicalVoiceAgent
