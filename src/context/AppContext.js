import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentDialogue, setCurrentDialogue] = useState({
    originalText: '',
    translatedText: ''
  });
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [dialogues] = useState([
    { original: 'Hello!', translated: '¡Hola!' },
    { original: 'How are you?', translated: '¿Cómo estás?' },
    { original: 'Goodbye!', translated: '¡Adiós!' }
  ]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const nextDialogue = () => {
    setCurrentDialogueIndex((prevIndex) => (prevIndex + 1) % dialogues.length);
  };

  const prevDialogue = () => {
    setCurrentDialogueIndex((prevIndex) =>
      prevIndex === 0 ? dialogues.length - 1 : prevIndex - 1
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentDialogue,
        setCurrentDialogue,
        recordingStatus,
        setRecordingStatus,
        dialogues,
        currentDialogueIndex,
        nextDialogue,
        prevDialogue
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
