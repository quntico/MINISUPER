
import React from 'react';
import { Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NumericKeypad = ({ onInput, onSubmit, onCancel }) => {
  const keys = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '0', '.', 'DEL'
  ];

  const handleKeyClick = (key) => {
    if (key === 'DEL') {
      onInput('Backspace');
    } else {
      onInput(key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((key) => (
        <Button
          key={key}
          variant="outline"
          className="h-16 text-xl font-bold bg-card hover:bg-accent"
          onClick={() => handleKeyClick(key)}
        >
          {key === 'DEL' ? <Delete className="w-6 h-6" /> : key}
        </Button>
      ))}
      <Button
        variant="destructive"
        className="h-16 text-lg font-bold col-span-1"
        onClick={onCancel}
      >
        ESC
      </Button>
      <Button
        className="h-16 text-lg font-bold col-span-2 bg-primary hover:bg-primary-hover text-primary-foreground"
        onClick={onSubmit}
      >
        ENTER
      </Button>
    </div>
  );
};

export default NumericKeypad;
