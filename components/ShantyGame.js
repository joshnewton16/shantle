import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { CardHeader } from './ui/card';
import { CardTitle } from './ui/card';
import { CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Youtube } from 'lucide-react';
import Keyboard from './Keyboard';

const ShantyGame = () => {
  const [currentShanty, setCurrentShanty] = useState(null);
  const [guessedWords, setGuessedWords] = useState(new Set());
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showYouTube, setShowYouTube] = useState(false);

  const MAX_ATTEMPTS = 10;
  const POINTS_PER_WORD = 100;
  const POINTS_PER_LETTER = 10;
  const POINTS_PER_HINT = -25;
  const POINTS_PER_ATTEMPT = -10;

  useEffect(() => {
    const loadShanty = async () => {
      try {
        const response = await fetch('/api/shanties');
        const data = await response.json();
        setCurrentShanty(data);
      } catch (error) {
        console.error('Error loading shanty:', error);
      }
    };
    loadShanty();
  }, []);

  const checkForCompletedWords = (word, guessedLetters) => {
    // Check if all letters in the word have been guessed
    return word.toLowerCase().split('').every(letter => 
      guessedLetters.has(letter.toLowerCase())
    );
  };

  const updateLettersAndScore = (guess) => {
    const newLetters = new Set(guessedLetters);
    let newLettersFound = 0;
    
    guess.toLowerCase().split('').forEach(letter => {
      if (!newLetters.has(letter)) {
        newLetters.add(letter);
        newLettersFound++;
      }
    });

    setGuessedLetters(newLetters);
    
    // Check for newly completed words
    const words = currentShanty.line.split(' ');
    const newGuessedWords = new Set(guessedWords);
    let newWordsCompleted = 0;

    words.forEach(word => {
      if (!guessedWords.has(word.toLowerCase()) && checkForCompletedWords(word, newLetters)) {
        newGuessedWords.add(word.toLowerCase());
        newWordsCompleted++;
      }
    });

    if (newWordsCompleted > 0) {
      setGuessedWords(newGuessedWords);
      setScore(prev => prev + (newWordsCompleted * POINTS_PER_WORD));
      
      // Check if game is won
      if (words.every(word => newGuessedWords.has(word.toLowerCase()))) {
        setGameWon(true);
        setShowYouTube(true);
      }
    }

    return newLettersFound;
  };

  const handleLetterClick = (letter) => {
    setCurrentGuess(prev => prev + letter.toLowerCase());
  };

  const handleGuess = async () => {
    if (!currentShanty) return;
    
    const guess = currentGuess.toLowerCase().trim();
    const words = currentShanty.line.toLowerCase().split(' ');
    
    if (guess === '') {
      setMessage('Please enter a word');
      return;
    }

    if (guessedWords.has(guess)) {
      setMessage("You've already guessed this word!");
      return;
    }

    setAttempts(prev => prev + 1);
    
    if (words.includes(guess)) {
      const newGuessedWords = new Set(guessedWords);
      newGuessedWords.add(guess);
      setGuessedWords(newGuessedWords);
      
      const newLettersFound = updateLettersAndScore(guess);
      setScore(prev => prev + POINTS_PER_WORD + (newLettersFound * POINTS_PER_LETTER));
      
      setMessage('Correct! You found a word!');
      
      if (words.every(word => newGuessedWords.has(word))) {
        setGameWon(true);
        setShowYouTube(true);
      }
    } else {
      const newLettersFound = updateLettersAndScore(guess);
      setScore(prev => prev + (newLettersFound * POINTS_PER_LETTER) + POINTS_PER_ATTEMPT);
      setMessage('Not a word in the shanty, but some letters might match!');
    }
    
    setCurrentGuess('');
  };

  const getHint = () => {
    if (!currentShanty || hintsRemaining <= 0) return;
    
    const words = currentShanty.line.toLowerCase().split(' ');
    const unguessedWords = words.filter(word => !guessedWords.has(word));
    
    if (unguessedWords.length > 0) {
      const randomWord = unguessedWords[Math.floor(Math.random() * unguessedWords.length)];
      setGuessedWords(prev => new Set([...prev, randomWord]));
      updateLettersAndScore(randomWord);
      setHintsRemaining(prev => prev - 1);
      setScore(prev => prev + POINTS_PER_HINT);
      
      if (words.every(word => guessedWords.has(word) || word === randomWord)) {
        setGameWon(true);
        setShowYouTube(true);
      }
    }
  };

  const getDisplayWord = (word) => {
    if (guessedWords.has(word.toLowerCase())) return word;
    
    // Check if all letters have been guessed
    if (checkForCompletedWords(word, guessedLetters)) {
      // Add to guessed words if not already there
      if (!guessedWords.has(word.toLowerCase())) {
        const newGuessedWords = new Set(guessedWords);
        newGuessedWords.add(word.toLowerCase());
        setGuessedWords(newGuessedWords);
      }
      return word;
    }
    
    return word.split('').map((letter) => 
      guessedLetters.has(letter.toLowerCase()) ? letter : '_'
    ).join('');
  };

  if (!currentShanty) return <div>Loading...</div>;

  const gameOver = gameWon || attempts >= MAX_ATTEMPTS;

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Daily Sea Shanty Challenge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-xl font-mono space-x-2">
          {currentShanty.line.split(' ').map((word, index) => (
            <span key={index}>{getDisplayWord(word)}</span>
          ))}
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <div>Attempts: {attempts}/{MAX_ATTEMPTS}</div>
          <div>Score: {score}</div>
          <div>Hints: {hintsRemaining}</div>
        </div>

        {!gameOver && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                placeholder="Enter a word"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
              />
              <Button onClick={handleGuess}>Guess</Button>
            </div>
            
            <Keyboard
              allWords={currentShanty.line.split(' ')}
              guessedWords={guessedWords}
              guessedLetters={guessedLetters}
              onLetterClick={handleLetterClick}
            />
            
            <Button 
              onClick={getHint}
              disabled={hintsRemaining <= 0}
              variant="outline"
              className="w-full"
            >
              Use Hint ({hintsRemaining} remaining)
            </Button>
          </div>
        )}
        
        {showYouTube && (
          <div className="text-center">
            <a
              href={`https://www.youtube.com/watch?v=${currentShanty.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Youtube size={24} />
              <span>Listen to {currentShanty.title}</span>
            </a>
          </div>
        )}
        
        {message && !gameOver && (
          <Alert className={message.includes('Correct') ? 'bg-green-100' : 'bg-yellow-100'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        {gameOver && (
          <Alert className={gameWon ? 'bg-green-100' : 'bg-red-100'}>
            <AlertTitle>{gameWon ? 'Congratulations!' : 'Game Over!'}</AlertTitle>
            <AlertDescription>
              {gameWon 
                ? `You've discovered the complete shanty line with a score of ${score}!` 
                : `Better luck next time! The line was: "${currentShanty.line}"`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ShantyGame;