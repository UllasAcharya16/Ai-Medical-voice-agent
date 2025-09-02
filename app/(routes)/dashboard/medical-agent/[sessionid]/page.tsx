"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { DoctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';

type sessionDetails = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: DoctorAgent,
  createdOn: string,
}

type message = {
  role: string,
  text: string
}

function MedicalVoiceAgent() {
  const { sessionid } = useParams();
  const [sessionDetails, setsessionDetails] = useState<sessionDetails>();
  const [callStarted, setCallStared] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<message[]>([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("useEffect triggered with sessionid:", sessionid);
    sessionid && GetsessionDetails();
  }, [sessionid]);

  const GetsessionDetails = async () => {
    try {
      const result = await axios.get('/api/session-chat?sessionId=' + sessionid);
      console.log("API Response (session details):", result.data);
      setsessionDetails(result.data);
    } catch (err) {
      console.error("Error fetching session details:", err);
    }
  }

  const StartCall = () => {
    console.log("StartCall triggered");
    setLoading(true);

    try {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
      setVapiInstance(vapi);

      console.log("Vapi instance created:", vapi);

      const doctor = sessionDetails?.selectedDoctor;
      console.log("Selected Doctor:", doctor);

      const VapiAgentConfig = {
        name: 'AI Medical Voice Agent',
        message: "Hi There! I am your Medical Assistant. How are you feeling?",
        transcriber: {
          provider: 'assembly-ai',
          language: 'en',
        },
        voice: {
          provider: '11labs',
          voiceId: doctor?.voiceId || "Rachel",
        },
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: doctor?.agentPrompt || "You are a helpful AI doctor."
          }]
        }
      }

      console.log("Vapi Agent Config:", VapiAgentConfig);

      //@ts-ignore
      vapi.start(VapiAgentConfig);

      vapi.on('call-start', () => {
        console.log("EVENT: Call started");
        setLoading(true);
        setCallStared(true);
      });

      vapi.on('call-end', () => {
        console.log("EVENT: Call ended");
        setCallStared(false);
      });

      vapi.on('message', (message) => {
        console.log("EVENT: Message received:", message);
        if (message.type === 'transscript') {
          const { role, transcriptType, transscript } = message;
          console.log(`Transcript Event -> Role: ${role}, Type: ${transcriptType}, Text: ${transscript}`);
          if (transcriptType === 'partial') {
            setLiveTranscript(transscript);
            setCurrentRole(role);
          } else if (transcriptType === 'final') {
            setMessages((prev: any) => [...prev, { role: role, text: transscript }]);
            setLiveTranscript("");
            setCurrentRole(null);
          }
        }
      });

      vapi.on('speech-start', () => {
        console.log("EVENT: Assistant started speaking");
        setCurrentRole('assistant');
      });

      vapi.on('speech-end', () => {
        console.log("EVENT: Assistant stopped speaking");
        setCurrentRole('user');
      });

    } catch (err) {
      console.error("Error in StartCall:", err);
    }
  }

  const endCall = () => {
    console.log("endCall triggered");
    if (!vapiInstance) {
      console.warn("No vapiInstance found to stop");
      return;
    }
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
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center '>
          <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
          {callStarted ? 'Connected..' : 'Not Connected'}
        </h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>

      {sessionDetails &&
        <div className='flex items-center flex-col mt-10 '>
          <Image src={sessionDetails?.selectedDoctor?.image}
            alt={sessionDetails?.selectedDoctor?.specialist ?? ''}
            width={120}
            height={120}
            className='h-[100px] w-[100px] object-cover border rounded-full' />
          <h2 className='mt-2 text-lg '>{sessionDetails?.selectedDoctor?.specialist}</h2>
          <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>

          <div className='mt-10 overflow-y-auto flex flex-col items-center px-20 md:px-28 lg:px-53 xl:px-72'>
            {messages?.slice(-4).map((msg: message, index) => (
              <h2 className='text-gray-400 p-2' key={index}>{msg.role}: {msg.text}</h2>
            ))}

            {liveTranscript && liveTranscript?.length > 0 &&
              <h2 className='text-lg'>{currentRole}: {liveTranscript}</h2>}
          </div>

          {!callStarted ?
            <Button className='mt-20' onClick={StartCall}><PhoneCall /> Start Call</Button> :
            <Button variant={'destructive'} onClick={endCall}> <PhoneOff /> End Call </Button>
          }
        </div>}
    </div>
  )
}

export default MedicalVoiceAgent
