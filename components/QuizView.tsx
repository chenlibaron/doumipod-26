import React, { useState, useRef, useCallback, useEffect, FC, TouchEvent } from 'react';
import { QuizCard, SubwayLine, Spot } from '../types';
import { Card } from './common/Card';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface QuizViewProps {
    spot: Spot;
    line: SubwayLine;
    quizzes: QuizCard[];
    onBack: () => void;
}

type AnswerState = {
    choice: string | null;
    isCorrect: boolean | null;
}

export const QuizView: FC<QuizViewProps> = ({ spot, line, quizzes, onBack }) => {
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
    
    // Swipe gesture state
    const touchStartX = useRef(0);
    const touchMoveX = useRef(0);
    const isSwiping = useRef(false);
    const swipeContainerRef = useRef<HTMLDivElement>(null);

    const handleAnswer = (choice: string) => {
        if (answers[currentQuizIndex]) return; // Already answered
        
        const isCorrect = choice === quizzes[currentQuizIndex].correct;
        setAnswers(prev => ({
            ...prev,
            [currentQuizIndex]: { choice, isCorrect }
        }));
    };

    const goToNext = useCallback(() => {
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
        }
    }, [currentQuizIndex, quizzes.length]);

    const goToPrev = useCallback(() => {
        if (currentQuizIndex > 0) {
            setCurrentQuizIndex(prev => prev - 1);
        }
    }, [currentQuizIndex]);

    const handleTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchMoveX.current = e.touches[0].clientX; // Initialize touchMoveX to prevent misinterpreting a tap as a swipe
        isSwiping.current = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if (!isSwiping.current) return;
        touchMoveX.current = e.touches[0].clientX;
        const deltaX = touchMoveX.current - touchStartX.current;
        if (swipeContainerRef.current) {
            swipeContainerRef.current.style.transition = 'none';
            swipeContainerRef.current.style.transform = `translateX(calc(-${currentQuizIndex * 100}% + ${deltaX}px))`;
        }
    };

    const handleTouchEnd = () => {
        if (!isSwiping.current) return;
        isSwiping.current = false;
        const deltaX = touchMoveX.current - touchStartX.current;
        
        if (swipeContainerRef.current) {
            swipeContainerRef.current.style.transition = 'transform 0.3s ease-out';
            if (deltaX < -50) { // Swipe left
                goToNext();
            } else if (deltaX > 50) { // Swipe right
                goToPrev();
            } else { // Snap back
                 swipeContainerRef.current.style.transform = `translateX(-${currentQuizIndex * 100}%)`;
            }
        }
        touchStartX.current = 0;
        touchMoveX.current = 0;
    };
    
    useEffect(() => {
        if (swipeContainerRef.current) {
            swipeContainerRef.current.style.transform = `translateX(-${currentQuizIndex * 100}%)`;
        }
    }, [currentQuizIndex]);


    const ChoiceButton: FC<{ quiz: QuizCard; choiceKey: string; text: string; answerState?: AnswerState }> = ({ quiz, choiceKey, text, answerState }) => {
        let buttonClass = "w-full text-left p-3 border rounded-lg transition-all duration-300 font-korean text-base ";
        if (answerState) {
            if (choiceKey === quiz.correct) {
                buttonClass += "bg-teal-100 dark:bg-teal-900/50 border-teal-500 text-teal-800 dark:text-teal-200";
            } else if (choiceKey === answerState.choice) {
                buttonClass += "bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200";
            } else {
                buttonClass += "bg-gray-100 dark:bg-slate-700/50 border-gray-300 dark:border-slate-600 text-gray-500 opacity-60";
            }
        } else {
             buttonClass += "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200";
        }

        return (
            <button onClick={() => handleAnswer(choiceKey)} disabled={!!answerState} className={buttonClass}>
                <span className="font-bold mr-2">{choiceKey}.</span> {text}
            </button>
        );
    };

    const allAnswered = Object.keys(answers).length === quizzes.length;
    
    return (
        <div className={`absolute inset-0 z-20 flex flex-col bg-slate-100 dark:bg-slate-900 font-korean p-4 animate-fade-in`}>
            <header className="flex items-center justify-between flex-shrink-0">
                <button onClick={onBack} className="flex items-center space-x-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Exit</span>
                </button>
                <h2 className="text-lg font-bold truncate" style={{ color: line.color }}>{spot.spot_name}</h2>
                <div className="w-16"></div>
            </header>

            <main 
                className="flex-1 flex flex-col overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div 
                    ref={swipeContainerRef}
                    className="flex w-full h-full transition-transform duration-300 ease-out"
                >
                    {quizzes.map((quiz, index) => (
                        <div key={quiz.id || index} className="w-full flex-shrink-0 overflow-y-auto scrollbar-hide p-1">
                            <div className="flex flex-col justify-center min-h-full">
                                <Card extraClasses="bg-white dark:bg-slate-800 shadow-xl w-full">
                                    <p className="text-sm font-semibold text-indigo-500 mb-2">{quiz.topic}</p>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 leading-relaxed">{quiz.question}</h3>
                                    <div className="space-y-3">
                                        {Object.entries(quiz.choices).map(([key, value]) => (
                                            <ChoiceButton key={key} quiz={quiz} choiceKey={key} text={String(value)} answerState={answers[index]}/>
                                        ))}
                                    </div>
                                </Card>
                                {answers[index] && (
                                    <div className={`mt-4 p-3 rounded-lg animate-fade-in-up ${answers[index]?.isCorrect ? 'bg-teal-500' : 'bg-red-500'}`}>
                                        <div className="flex items-center space-x-2">
                                            {answers[index]?.isCorrect ? <CheckCircleIcon className="w-5 h-5 text-white"/> : <XCircleIcon className="w-5 h-5 text-white"/>}
                                            <h4 className="font-bold text-base text-white">{answers[index]?.isCorrect ? 'Correct!' : 'Incorrect'}</h4>
                                        </div>
                                        <p className={`text-sm mt-1 ${answers[index]?.isCorrect ? 'text-teal-100' : 'text-red-100'}`}>
                                            <span className="font-semibold text-white">Answer:</span> {quiz.choices[quiz.correct as keyof typeof quiz.choices]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="flex flex-col items-center flex-shrink-0">
                 <div className="flex items-center justify-center space-x-2 my-4">
                    {quizzes.map((_, index) => (
                        <div key={index} className={`h-2 rounded-full transition-all duration-300 ${currentQuizIndex === index ? 'w-4 bg-indigo-500' : 'w-2 bg-gray-300 dark:bg-gray-600'}`} />
                    ))}
                </div>
                <div className="w-full flex items-center justify-center max-w-sm h-12">
                    {allAnswered && (
                        <button onClick={onBack} className="px-6 py-2 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-teal-600 animate-fade-in">
                            Finish
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};