import React, { useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function Dictaphone() {
    const { transcript, resetTranscript } = useSpeechRecognition()

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return null
    } else {
        SpeechRecognition.startListening();
    }
  
    return (
      <div>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>
    )
}