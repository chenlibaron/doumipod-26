import React, { useState, useCallback, FC } from 'react';
import { Card } from '../common/Card';
import { TOPIKQuestion } from '../../types';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '../icons/Icons';
import { generateTOPIKQuestions } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const TOPIKPrepView: FC = () => {
    type TOPIKViewState = 'menu' | 'test' | 'results';
    type AnswerState = 'unanswered' | 'correct' | 'incorrect';
    
    const [view, setView] = useState<TOPIKViewState>('menu');
    const [error, setError] = useState<string | null>(null);

    const [topikLevel, setTopikLevel] = useState<'I' | 'II'>('I');
    const [topikQuestions, setTopikQuestions] = useState<TOPIKQuestion[]>([]);
    const [isTOPIKLoading, setIsTOPIKLoading] = useState(false);
    const [tCurrentIndex, setTCurrentIndex] = useState(0);
    const [tUserAnswers, setTUserAnswers] = useState<{[key: number]: string}>({});
    const [tSelectedOption, setTSelectedOption] = useState<string | null>(null);
    const [tAnswerState, setTAnswerState] = useState<AnswerState>('unanswered');

    const startTOPIKTest = useCallback(async (level: 'I' | 'II') => {
        setTopikLevel(level);
        setView('test');
        setIsTOPIKLoading(true);
        setError(null);
        try {
            const questions = await generateTOPIKQuestions(level);
            setTopikQuestions(questions);
            setTCurrentIndex(0);
            setTUserAnswers({});
            setTSelectedOption(null);
            setTAnswerState('unanswered');
        } catch (err) {
            setError('Failed to generate TOPIK questions. Please try again later.');
            setView('menu');
        } finally {
            setIsTOPIKLoading(false);
        }
    }, []);

    const handleTOPIKAnswer = (optionKey: string) => {
        if (tAnswerState !== 'unanswered') return;
        setTSelectedOption(optionKey);
        const currentQuestion = topikQuestions[tCurrentIndex];
        setTUserAnswers(prev => ({...prev, [tCurrentIndex]: optionKey}));
        setTAnswerState(optionKey === currentQuestion.answer ? 'correct' : 'incorrect');
    };

    const nextTOPIKQuestion = () => {
        if (tCurrentIndex < topikQuestions.length - 1) {
            setTCurrentIndex(prev => prev + 1);
            setTSelectedOption(null);
            setTAnswerState('unanswered');
        } else {
            setView('results');
        }
    };
    
    const renderMenu = () => (
         <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">TOPIK Exam Preparation</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Choose a level to start a practice test.</p>
            <div className="space-y-4 max-w-sm mx-auto">
                <Card extraClasses="hover:shadow-lg transition-shadow cursor-pointer bg-blue-50 dark:bg-blue-900/30">
                    <button onClick={() => startTOPIKTest('I')} className="w-full text-left p-2">
                        <h2 className="font-bold text-lg text-blue-800 dark:text-blue-200">TOPIK I Practice Test</h2>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Generate a 5-question test for beginner level.</p>
                    </button>
                </Card>
                <Card extraClasses="hover:shadow-lg transition-shadow cursor-pointer bg-green-50 dark:bg-green-900/30">
                    <button onClick={() => startTOPIKTest('II')} className="w-full text-left p-2">
                        <h2 className="font-bold text-lg text-green-800 dark:text-green-200">TOPIK II Practice Test</h2>
                        <p className="text-sm text-green-600 dark:text-green-400">Generate a 5-question test for intermediate-advanced level.</p>
                    </button>
                </Card>
            </div>
             {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
    );

    const renderTOPIKTest = () => {
        if (isTOPIKLoading) return <div className="p-4 flex flex-col items-center justify-center h-full"><LoadingSpinner /><p className="mt-2 text-gray-600 dark:text-gray-400">Generating TOPIK questions...</p></div>;
        if (!topikQuestions.length) return <p>No questions found.</p>;
        
        const currentQuestion = topikQuestions[tCurrentIndex];
        const progress = ((tCurrentIndex + 1) / topikQuestions.length) * 100;
        return (
            <div>
                 <button onClick={() => setView('menu')} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4"><ArrowLeftIcon className="w-4 h-4 mr-1"/> Change Level</button>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <Card>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question {tCurrentIndex + 1} of {topikQuestions.length}</p>
                    {currentQuestion.passage_korean && (
                        <div className="mb-4 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                             <p className="font-semibold font-korean text-gray-800 dark:text-gray-200 leading-relaxed">{currentQuestion.passage_korean}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed italic">({currentQuestion.passage_english})</p>
                        </div>
                    )}
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 font-korean">{currentQuestion.question}</h2>
                    <div className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => {
                            let buttonClass = 'w-full text-left p-3 border rounded-lg transition-colors font-korean ';
                            if (tAnswerState !== 'unanswered') {
                                if (key === currentQuestion.answer) {
                                    buttonClass += 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200';
                                } else if (key === tSelectedOption) {
                                    buttonClass += 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200';
                                } else {
                                     buttonClass += 'bg-gray-100 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 text-gray-500 opacity-60';
                                }
                            } else {
                                buttonClass += 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700/50';
                            }
                            return <button key={key} onClick={() => handleTOPIKAnswer(key)} disabled={!!tSelectedOption} className={buttonClass}>{key} {String(value)}</button>
                        })}
                    </div>
                </Card>
                {tAnswerState !== 'unanswered' && (
                    <div className={`mt-4 p-4 rounded-lg animate-fade-in-up ${tAnswerState === 'correct' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                        <div className="flex items-center space-x-2">
                            {tAnswerState === 'correct' ? <CheckCircleIcon className="w-6 h-6 text-green-500"/> : <XCircleIcon className="w-6 h-6 text-red-500"/>}
                            <h4 className="font-bold text-lg">{tAnswerState === 'correct' ? 'Correct!' : 'Incorrect'}</h4>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{currentQuestion.explanation}</p>
                        <button onClick={nextTOPIKQuestion} className="w-full mt-3 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600">
                            {tCurrentIndex < topikQuestions.length - 1 ? 'Next' : 'See Results'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderResults = () => {
        const score = Object.values(tUserAnswers).filter((answer, index) => answer === topikQuestions[index].answer).length;
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Test Complete!</h1>
                <p className="text-lg mt-2">Your Score: <span className="font-bold text-indigo-500">{score} / {topikQuestions.length}</span></p>
                <button onClick={() => startTOPIKTest(topikLevel)} className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-lg">Try Again</button>
                <button onClick={() => setView('menu')} className="mt-2 px-6 py-2 text-indigo-500">Back to Menu</button>
            </div>
        );
    }

    switch (view) {
        case 'test': return renderTOPIKTest();
        case 'results': return renderResults();
        case 'menu': default: return renderMenu();
    }
};