"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { DoctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, Languages, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import { Messages } from 'openai/resources/chat/completions.mjs';
import { div } from 'motion/react-client';
import Provider from '@/app/Provider';

type sessionDetails={
  id:number,
  notes:string,
  sessionId:string,
  report:JSON,
  selectedDoctor:DoctorAgent,
  createdOn:string,
  
}

type message={
  role:string,
  text:string
}

function MedicalVoiceAgent() {
   const {sessionid}= useParams();
   const [sessionDetails,setsessionDetails]=useState<sessionDetails>();
   const [callStarted ,setCallStared]=useState(false);
   const [vapiInstance,setVapiInstance]=useState<any>();
   const [currentRole,setCurrentRole]=useState<string| null>();
   const [liveTranscript, setLiveTranscript]=useState<string>();
   const [messages,setMessages]=useState< message[]>([]);
   const [Loading ,setLoading]=useState(false);

 
   useEffect(()=> {
    
    sessionid&&GetsessionDetails();

   },[sessionid])

   const GetsessionDetails=async()=>{
    
       const result = await axios.get('/api/session-chat?sessionId='+sessionid)
       console.log(result.data);
       setsessionDetails(result.data);
   }

   const StartCall=()=>{
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
      setVapiInstance(vapi);

      const VapiAgentConfig={
        
        name:'AI Medical Voice Agent',
        message:"Hi There!.I am your Medical Assistant.I am here to help you with any health questions or concerns you might have today.How are you feeling?",
        transcriber:{

           provider:'assembly-ai',
           language:'en',
        },
        voice:{
             
          provider:'playht',
          voiceId:sessionDetails?.selectedDoctor?.voiceId
        },
        model:{

          provider:'openai',
          model:'gpt-4',
          messages:{

            role:'system',
            content:sessionDetails?.selectedDoctor?.agentPrompt
          }
        }
      }
     
      //@ts-ignore
     vapi.start(VapiAgentConfig);


     vapi.on('call-start', () => {
      setLoading(true);
      console.log('Call started')
      setCallStared(true);
     });
     vapi.on('call-end', () => {console.log('Call ended')




      setCallStared(false);
     });
     vapi.on('message', (message) => {
      if(message.type=='transscript'){
       const {role,transcriptType,transscript}=message;
       console.log(`${message.role}: ${message.transcript}`);
       if(transcriptType=='partial'){
       setLiveTranscript(transscript);
       setCurrentRole(role);
      }else if(transcriptType=='final'){

        setMessages((prev:any)=>[...prev,{role:role,text:transscript}]);
        setLiveTranscript("");
        setCurrentRole(null);
      }
        {

      }
    }
});
    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant');
    });
    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });

   }


  const endCall = () => {
     if(!vapiInstance)return;
      vapiInstance.stop();

      vapiInstance.off('call-start');
      vapiInstance.off('call-end');
      vapiInstance.off('message');

      setCallStared(false);
      setVapiInstance(null);
    
  };
  return (
   
    <div className='p-5 border rounded-3xl bg-secondary'>
     <div className='flex justify-between items-center'>
       <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center '>  <Circle className={`h-4 w-4 rounded-full ${callStarted?'bg-green-500':'bg-red-500'}`}/> {callStarted?'Conected..':'Not Conected'}</h2>
       <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
     </div>

   

      {sessionDetails&& 
      <div className='flex items-center flex-col mt-10 '>
      <Image src={sessionDetails?.selectedDoctor?.image}
       alt={sessionDetails?.selectedDoctor?.specialist??''}
       width={120}
       height={120} 
       className='h-[100px] w-[100px] object-cover border rounded-full'/>
      <h2 className='mt-2 text-lg '>{sessionDetails?.selectedDoctor?.specialist}</h2>
      <p className='text-sm text-gray-400'>Ai Medical Voice Agent</p>

      <div className='mt-10 overflow-y-auto flex flex-col items-center px-20 md:px-28 lg:px-53 xl:px-72'>
        {messages?.slice(-4).map((msg:message,index)=>(


                <h2 className='text-gray-400 p-2' key={index}>{msg.role}{msg.text}</h2>


        ))}
        

        {liveTranscript && liveTranscript?.length>0&&<h2 className='text-lg'>{currentRole}:{liveTranscript}</h2>}
      
      </div>

      {!callStarted?<Button className='mt-20' onClick={StartCall}><PhoneCall/> 
      Start Call
      </Button>:
      
      <Button variant={'destructive'} onClick={endCall}> <PhoneOff/> End Call </Button>
      }

     </div>}
    </div>
  )
}

export default MedicalVoiceAgent
