import React from 'react';
import { AppProvider } from './context/AppContext';
import VideoPlayer from './components/VideoPlayer';
import AudioRecorder from './components/AudioRecorder';
import DialogueDisplay from './components/DialogueDisplay';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Video & Audio Application</h1>
        <VideoPlayer />
        <AudioRecorder />
        <DialogueDisplay />
      </div>
    </AppProvider>
  );
}

export default App;
