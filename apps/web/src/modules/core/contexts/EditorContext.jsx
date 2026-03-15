
import React, { createContext, useContext, useState } from 'react';

const EditorContext = createContext(null);

export const EditorProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => setIsEditMode(prev => !prev);

  return (
    <EditorContext.Provider value={{ isEditMode, toggleEditMode }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor debe usarse dentro de un EditorProvider');
  }
  return context;
};
