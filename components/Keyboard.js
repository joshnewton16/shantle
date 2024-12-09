import React from 'react';
import { Button } from './ui/button';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const getKeyColor = (letter, allWords, guessedWords, guessedLetters) => {
  letter = letter.toLowerCase();
  
  if (!guessedLetters.has(letter)) {
    return 'bg-white hover:bg-gray-100';
  }
  
  const wordsWithLetter = allWords.filter(word => 
    word.toLowerCase().includes(letter)
  );
  
  if (wordsWithLetter.length === 0) {
    return 'bg-gray-300';
  }
  
  const allWordsWithLetterGuessed = wordsWithLetter.every(word =>
    guessedWords.has(word.toLowerCase())
  );
  
  return allWordsWithLetterGuessed ? 'bg-green-300' : 'bg-yellow-300';
};

const Keyboard = ({ allWords, guessedWords, guessedLetters, onLetterClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex justify-center gap-1 ${
            rowIndex === 1 ? 'ml-4' : rowIndex === 2 ? 'ml-8' : ''
          }`}
        >
          {row.map((letter) => (
            <Button
              key={letter}
              onClick={() => onLetterClick(letter)}
              className={`w-8 h-10 p-0 font-bold ${
                getKeyColor(letter, allWords, guessedWords, guessedLetters)
              }`}
            >
              {letter}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;