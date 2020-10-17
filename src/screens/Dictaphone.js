import React, { useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function Dictaphone() {
  const [message, setMessage] = useState("Blank Message")

  const commands = [
    
  ]

  if (SpeechRecognition.browserSupportsSpeechRecognition()) {
    SpeechRecognition.startListening();
  }

  var {transcript} = useSpeechRecognition({commands})

  return (
    <div>
      <p1>{message}</p1>
      <p1>{transcript}</p1>
    </div>
  )

}