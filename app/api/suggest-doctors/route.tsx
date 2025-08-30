import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {

      const {notes} = await req.json();
    try{
    const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-exp:free',
    messages: [
        {role:'system',content:JSON.stringify(AIDoctorAgents)},
        {role: 'user',content: "User Notes/Symptoms"+notes+"Depends on User notes and symptoms , Please Suggest list of Doctors,Return object in JSON only" }
    ],
  });
  const rawResponce =completion.choices[0].message
  //@ts-ignore
  const Resp = rawResponce.content.trim().replace('```json','').replace('```','')
  const JSOnResp =JSON.parse(Resp);
  return NextResponse.json(JSOnResp );
    }
    catch(e) {
   return NextResponse.json(e);

    }
}