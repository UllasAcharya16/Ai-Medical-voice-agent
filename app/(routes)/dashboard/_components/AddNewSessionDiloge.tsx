"use client"

import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import axios from 'axios'
import DoctorAgentCard, { DoctorAgent } from './DoctorAgentCard'
import { Loader2 } from 'lucide-react'
import SuggestedDoctorCard from './SuggestedDoctorCard';
import { useRouter } from 'next/navigation'

function AddNewSessionDiloge() {
  const [note, setNote] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>([]) // ✅ initialize as empty array
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent>()

  const router = useRouter();

  const OnClickNext = async () => {
    try {
      setLoading(true)
      const result = await axios.post('/api/suggest-doctors', {
        notes: note,
      })
      console.log(result.data)

      // ✅ Make sure we always set an array
      if (Array.isArray(result.data)) {
        setSuggestedDoctors(result.data)
      } else if (Array.isArray(result.data.doctors)) {
        setSuggestedDoctors(result.data.doctors)
      } else {
        setSuggestedDoctors([])
      }
    } finally {
      setLoading(false)
    }
  }

  const onStartConsultation = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/session-chat', {
        notes: note,
        selectedDoctor: selectedDoctor
      });
      console.log(result.data);

      if (result.data?.sessionId) {
        router.push('/dashboard/medical-agent/' + result.data.sessionId);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full mt-2">
            +Start Consultation
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Basic Details</DialogTitle>
            <DialogDescription asChild>
              {suggestedDoctors.length === 0 ? (
                <div>
                  <h2>Add Symptoms or Any Other Detail</h2>
                  <Textarea
                    placeholder="Add Detail here..."
                    className="h-[200px] mt-1"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <h2>Select The Doctors</h2>
                  <div className='grid grid-cols-3 gap-5'>
                    {suggestedDoctors.map((doctor, index) => (
                      <SuggestedDoctorCard
                        doctorAgent={doctor}
                        key={index}
                        setSelectedDoctor={() => setSelectedDoctor(doctor)}
                        //@ts-ignore
                        selectedDoctor={selectedDoctor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={'outline'}>Cancel</Button>
            </DialogClose>
            {suggestedDoctors.length === 0 ? (
              <Button disabled={!note || loading} onClick={OnClickNext}>
                Next {loading ? <Loader2 className='animate-spin' /> : <IconArrowRight />}
              </Button>
            ) : (
              <Button disabled={loading || !selectedDoctor} onClick={onStartConsultation}>
                Start Consultation {loading ? <Loader2 className="animate-spin" /> : <IconArrowRight />}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewSessionDiloge
