
"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react'
import AddNewSessionDiloge from './AddNewSessionDiloge';

function HistoryList() {

    const [historyList ,setHistoryList]= useState([]);
  return (
    <div className='mt-10'>
      {historyList.length==0 ?      
      <div className='flex items-center flex-col justify-center  p-7 border border-dashed rounded-2xl border-2'>
        <Image src={'/medical-assistance.png'} alt ='empty'
         width={150}
          height={150}
          />
          <h2 className='font-bold text-xl mt-2'>No Recent Consultation</h2>
          <p>Its look like you haven't Consulted with any doctor yet.</p>
          <AddNewSessionDiloge/>
      </div>:
      <div>
        List
      </div>
    }
    </div>
  )
}

export default HistoryList
