import { useState } from 'react';
import { useEffect } from 'react';
import './App.css'

function App() {

  useEffect(() => {

    (async () => {
      const response = await fetch('http://localhost:3000');
      const data = await response.text();
      console.log(data);
    })()
  });


  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setAudioChunks((currentChunks) => [...currentChunks, event.data]);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing audio device:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      // Reset the mediaRecorder and audioChunks state
      setMediaRecorder(null);
      setAudioChunks([]);
    }
  };

  const sendAudioToServer = async () => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob);

      try {
        const response = await fetch('http://localhost:3000/upload-audio', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error sending audio to server:', error);
      }
    }
  };

  return (
    <div>

      <h1>Audio Capture</h1>

      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording || <button onClick={sendAudioToServer}>Send Audio to Server</button>}
    </div>
  );
}

export default App
