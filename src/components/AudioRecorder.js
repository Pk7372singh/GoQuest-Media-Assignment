import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

const AudioRecorder = () => {
  const { setRecordingStatus } = useContext(AppContext);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(new Uint8Array(0));
  const [canvasVisible, setCanvasVisible] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initAudio = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const context = new (window.AudioContext || window.webkitAudioContext)();
          const recorder = new MediaRecorder(stream);
          const analyserNode = context.createAnalyser();

          recorder.ondataavailable = (event) => {
            setAudioBlob(event.data);
            const url = URL.createObjectURL(event.data);
            setAudioUrl(url);
          };

          recorder.onstop = () => {
            setRecordingStatus(false);
            setCanvasVisible(true);
          };

          setMediaRecorder(recorder);
          setAudioContext(context);
          setAnalyser(analyserNode);

          const source = context.createMediaStreamSource(stream);
          source.connect(analyserNode);
          analyserNode.connect(context.destination);
          analyserNode.fftSize = 2048;

          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          setDataArray(dataArray);

          const updateDataArray = () => {
            if (recording && analyserNode) {
              analyserNode.getByteTimeDomainData(dataArray);
              requestAnimationFrame(updateDataArray);
            }
          };

          updateDataArray();
        } catch (error) {
          console.error('Error accessing microphone:', error);
        }
      }
    };

    initAudio();

    return () => {
      if (audioContext) {
        try {
          audioContext.close();
        } catch (error) {
          console.warn('AudioContext is already closed:', error);
        }
      }
    };
  }, ); 

  useEffect(() => {
    const drawWaveform = () => {
      if (!canvasRef.current || !analyser || !recording) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };

    const animationId = requestAnimationFrame(drawWaveform);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dataArray, analyser, recording]);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
      setRecordingStatus(true);
      setCanvasVisible(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Audio Recorder</h2>
      <div className="flex space-x-2">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`flex-1 ${recording ? 'bg-red-500' : 'bg-green-500'} text-white py-2 rounded hover:bg-opacity-75 transition`}
        >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {audioBlob && !recording && (
          <button
            onClick={playAudio}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Play Recording
          </button>
        )}
      </div>
      {canvasVisible && (
        <div className="mt-4">
          <canvas ref={canvasRef} width="400" height="100" className="w-full border border-gray-300 rounded"></canvas>
        </div>
      )}
      {audioUrl && (
        <div className="mt-4">
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
