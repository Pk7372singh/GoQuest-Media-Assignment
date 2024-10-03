import React, { useRef, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentDialogue, } = useContext(AppContext);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (event) => {
    const seekTime = (event.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Video Player</h2>
      <video
        ref={videoRef}
        className="w-full rounded-lg"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        src="VideoP.mp4" 
      />
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlay}
          className={`mt-2 px-4 py-2 rounded text-white ${isPlaying ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full mx-2"
        />
      </div>
      
    </div>
  );
};

export default VideoPlayer;
