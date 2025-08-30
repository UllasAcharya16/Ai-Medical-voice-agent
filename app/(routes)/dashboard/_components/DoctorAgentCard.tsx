import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'
import AddNewSessionDiloge from './AddNewSessionDiloge'

export type DoctorAgent = {
  id: number,
  specialist: string,
  description: string,
  image: string,
  agentPrompt: string
}

type Props = {
  doctorAgent: DoctorAgent
}

function DoctorAgentCard({ doctorAgent }: Props) {
  return (
    <div >
      {/* You can render doctorAgent fields here */}
      <Image src={doctorAgent.image} alt={doctorAgent.specialist} width={200} height={300} className='w-full h-[250px] object-cover rounded-xl'/>
      <h2 className='font-bold mt-1 '>{doctorAgent.specialist}</h2>
      <p className='line-clamp-2  text-sm text-gray-500'>{doctorAgent.description}</p>
      <AddNewSessionDiloge/>
    </div>
  )
}

export default DoctorAgentCard
