import React, { FC } from 'react';
import { QuizView } from '../components/QuizView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useSubwayGame, GameState } from '../hooks/useSubwayGame';
import { SpotSuggestionView } from '../components/game/SpotSuggestionView';
import { ActionSelectionView } from '../components/game/ActionSelectionView';
import { ExploreCategoriesView } from '../components/game/ExploreCategoriesView';
import { ExploreContentView } from '../components/game/ExploreContentView';
import { SubwayMap } from '../components/game/SubwayMap';

export const GamePage: FC = () => {
    const {
        gameState,
        isLoading,
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
    } = useSubwayGame();

    const renderGameState = () => {
        switch(gameState) {
            case 'spot-suggestion':
                return selectedStation && <SpotSuggestionView spots={suggestedSpots} onSelect={handleSpotSelect} stationName={selectedStation.name} onBack={() => handleBack('map')} />;
            case 'action-selection':
                return selectedSpot && <ActionSelectionView spot={selectedSpot} onSelect={handleActionSelect} onBack={() => handleBack('spot-suggestion')} />;
            case 'explore-categories':
                return <ExploreCategoriesView onSelect={handleCategorySelect} onBack={() => handleBack('action-selection')} />;
            case 'explore-content':
                return exploreContent && <ExploreContentView content={exploreContent} image={exploreContentImage} isImageLoading={isImageLoading} onBack={() => handleBack('explore-categories')} playAudio={playAudio} audioLoadingLine={audioLoadingLine} />;
            case 'quiz':
                return selectedSpot && <QuizView spot={selectedSpot} line={selectedLine} quizzes={quizCards} onBack={() => handleBack('action-selection')} />;
            case 'map':
            default:
                return null;
        }
    };
    
    return (
        <div className="h-full w-full bg-slate-900 text-white overflow-hidden relative font-korean">
             <style>{`
                .station-node.animate-pulse {
                    animation: pulse-ring 2s infinite;
                }
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0px ${selectedLine.color}99; }
                    70% { box-shadow: 0 0 0 10px ${selectedLine.color}00; }
                    100% { box-shadow: 0 0 0 0px ${selectedLine.color}00; }
                }
            `}</style>

            <div className={`h-full flex flex-col transition-all duration-500 ${gameState !== 'map' ? 'blur-sm scale-95 brightness-50' : ''}`}>
                <SubwayMap
                    lines={lines}
                    selectedLine={selectedLine}
                    stationStops={stationStops}
                    onSelectLine={setSelectedLine}
                    onNodeClick={handleNodeClick}
                />
            </div>
            
            {error && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-800/90 p-4 rounded-lg z-30"><p>{error}</p><button onClick={() => setError(null)} className="mt-2 text-xs underline">Dismiss</button></div>}
            {isLoading && <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-30"><LoadingSpinner /><p className="text-white mt-2">Loading...</p></div>}
            
            {renderGameState()}
        </div>
    );
};