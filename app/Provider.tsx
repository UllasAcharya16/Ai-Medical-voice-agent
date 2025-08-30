"use client"

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/USerDetailContext';

export type UsersDetail={
  name:string,
  email :string,
  credits:number
}

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  const {user } = useUser();
  const [UserDetail,setUserDetail] = useState<any>();
    useEffect (()=>{
   
        user&&createnewUser();
      },[user])
    
    const createnewUser =async() =>{
   
        const result =await axios.post('/api/users');
        console.log(result.data);
        setUserDetail(result.data);
    } 
    
    return (
    <div>
      <UserDetailContext value={{UserDetail,setUserDetail}}>
        {children}
      </UserDetailContext>
    </div>
  )
}

export default Provider
