import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const DialogueDisplay = () => {
  const { dialogues, currentDialogueIndex, nextDialogue, prevDialogue, updateDialogue } = useContext(AppContext);
  const currentDialogue = dialogues[currentDialogueIndex];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateDialogue(currentDialogueIndex, name, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Dialogue Display</h2>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-gray-700">Original Text:</label>
          <input
            type="text"
            name="original"
            value={currentDialogue.original}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Translated Text:</label>
          <input
            type="text"
            name="translated"
            value={currentDialogue.translated}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-between">
          <button onClick={prevDialogue} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">Previous</button>
          <button onClick={nextDialogue} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">Next</button>
        </div>
      </div>
    </div>
  );
};

export default DialogueDisplay;
