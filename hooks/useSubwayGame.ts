import React, { useState, useCallback, useMemo, useRef } from 'react';
import { generateSpotsForStation, generateExploreContent, generateQuizForSpot, generateRealisticLocationImage } from '../services/api';
import { seoulSubwayLines } from '../data/subwayData';
import { useAppContext } from '../contexts/AppContext';
import { useGameAudio } from './useGameAudio';
import { SubwayStop } from '../types';

export type GameState = 'map' | 'spot-suggestion' | 'action-selection' | 'explore-categories' | 'explore-content' | 'quiz';

export const useSubwayGame = () => {
    const { setIsGameModeActive } = useAppContext();
    const { playArrivalSequence, playAudio, audioLoadingLine, isSequencePlaying } = useGameAudio();
    
    // Core Game State
    const [gameState, setGameState] = useState<GameState>('map');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Map State
    const [lines] = useState(seoulSubwayLines);
    const [selectedLine, setSelectedLine] = useState(lines[1]);
    const [userProgress] = useState<{ [key: number]: string[] }>({});
    const [lastSelectedStations, setLastSelectedStations] = useState<{ [key: number]: string }>({});

    // Content State
    const [selectedStation, setSelectedStation] = useState<SubwayStop | null>(null);
    const [suggestedSpots, setSuggestedSpots] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [exploreContent, setExploreContent] = useState(null);
    const [quizCards, setQuizCards] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [exploreContentImage, setExploreContentImage] = useState(null);
    
    // Swipe gesture state
    const touchStartX = useRef(0);
    const touchMoveX = useRef(0);
    const isSwiping = useRef(false);
    const swipeContainerRef = useRef<HTMLDivElement>(null);
    
    const stationStops = useMemo(() => {
        const completedStops = new Set(userProgress[selectedLine.line_number] || []);
        const lastSelected = lastSelectedStations[selectedLine.line_number];
        let hasFoundCurrent = false;

        return selectedLine.stops.map((stopName, index) => {
            let status: SubwayStop['status'] = 'new';
            if (completedStops.has(stopName)) {
                status = 'completed';
            } else if (lastSelected && stopName === lastSelected) {
                status = 'current';
                hasFoundCurrent = true;
            } else if (!lastSelected && !hasFoundCurrent) {
                status = 'current';
                hasFoundCurrent = true;
            }
            return { id: `${selectedLine.line_number}-${index}`, name: stopName, status };
        });
    }, [selectedLine, userProgress, lastSelectedStations]);

    const handleNodeClick = useCallback(async (stop: SubwayStop) => {
        if (isLoading || isSequencePlaying) return;
        
        setLastSelectedStations(prev => ({ ...prev, [selectedLine.line_number]: stop.name }));
        setSelectedStation(stop);

        try {
            await playArrivalSequence(stop.name);
            setIsGameModeActive(true);
            setIsLoading(true);
            const spots = await generateSpotsForStation(stop.name);
            setSuggestedSpots(spots);
            setGameState('spot-suggestion');
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
            setSelectedStation(null);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, isSequencePlaying, playArrivalSequence, setIsGameModeActive, selectedLine.line_number]);

    const handleSpotSelect = useCallback((spot) => {
        setSelectedSpot(spot);
        setGameState('action-selection');
    }, []);

    const handleActionSelect = useCallback(async (action) => {
        if (!selectedSpot || !selectedStation) return;
        
        if (action === 'explore') {
            setGameState('explore-categories');
        } else {
            setIsLoading(true);
            try {
                const quizData = await generateQuizForSpot(selectedSpot, selectedStation.name);
                setQuizCards(quizData.quiz_cards);
                setGameState('quiz');
            } catch (e) {
                setError("Failed to generate a quiz for this spot.");
                setGameState('action-selection');
            } finally {
                setIsLoading(false);
            }
        }
    }, [selectedSpot, selectedStation]);
    
    const handleCategorySelect = useCallback(async (category) => {
        if (!selectedSpot) return;
        
        setIsLoading(true);
        setIsImageLoading(true);
        setSelectedCategory(category);
        setGameState('explore-content'); // Move to content view immediately to show loaders
        try {
            const [content, imageData] = await Promise.all([
                generateExploreContent(selectedSpot, category),
                generateRealisticLocationImage(selectedSpot.spot_name)
            ]);
            setExploreContent(content);
            setExploreContentImage(imageData);
        } catch (e) {
            setError("Failed to generate content for this category.");
            setGameState('explore-categories'); // Go back on error
        } finally {
            setIsLoading(false);
            setIsImageLoading(false);
        }
    }, [selectedSpot]);
    
    const handleBack = useCallback((toState: GameState) => {
        setError(null);
        setGameState(toState);
        if (toState === 'map') {
            setSelectedStation(null);
            setIsGameModeActive(false);
        }
        if (toState === 'spot-suggestion') setSelectedSpot(null);
        if (toState === 'action-selection') {
            setQuizCards([]);
            setSelectedCategory(null);
        }
        if (toState === 'explore-categories') {
            setExploreContent(null);
            setExploreContentImage(null);
        }
    }, [setIsGameModeActive]);

    return {
        gameState,
        isLoading: isLoading || isSequencePlaying,
        error,
        lines,
        selectedLine,
        stationStops,
        suggestedSpots,
        selectedStation,
        selectedSpot,
        quizCards,
        exploreContent,
        exploreContentImage,
        isImageLoading,
        audioLoadingLine,
        setError,
        setSelectedLine,
        handleNodeClick,
        handleSpotSelect,
        handleActionSelect,
        handleCategorySelect,
        handleBack,
        playAudio,
    };
};