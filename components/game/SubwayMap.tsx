import React, { FC, CSSProperties } from 'react';
import { SubwayLine, SubwayStop } from '../../types';

const darkenHexColor = (hex: string, percent: number): string => {
    const hexVal = hex.replace(/^#/, '');
    let r = parseInt(hexVal.substring(0, 2), 16);
    let g = parseInt(hexVal.substring(2, 4), 16);
    let b = parseInt(hexVal.substring(4, 6), 16);
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));
    const toHex = (c: number) => ('00' + c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const LineSelector: FC<{
    lines: SubwayLine[];
    selectedLine: SubwayLine;
    onSelectLine: (line: SubwayLine) => void;
}> = ({ lines, selectedLine, onSelectLine }) => (
    <header className="p-2 bg-black/20 backdrop-blur-sm flex-shrink-0 z-20">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide p-1">
            {lines.map(line => (
                <button
                    key={line.line_number}
                    onClick={() => onSelectLine(line)}
                    className={`flex-shrink-0 px-3 py-1 text-sm font-bold rounded-full transition-all duration-300 ${selectedLine.line_number === line.line_number ? 'text-white shadow-lg' : 'bg-transparent text-gray-400'}`}
                    style={{ backgroundColor: selectedLine.line_number === line.line_number ? line.color : 'transparent' }}
                >
                    {line.line_number}호선
                </button>
            ))}
        </div>
    </header>
);

const StationNode: FC<{
    stop: SubwayStop;
    lineColor: string;
    onNodeClick: (stop: SubwayStop) => void;
}> = ({ stop, lineColor, onNodeClick }) => (
    <div className="relative h-28">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-3/4 flex items-center gap-3">
            <div className="w-8 h-1" style={{ backgroundColor: lineColor }}></div>
            <button
                onClick={() => onNodeClick(stop)}
                className={`station-node relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 bg-white shadow-lg flex-shrink-0 ${stop.status === 'current' ? 'animate-pulse' : ''}`}
                style={{ '--tw-shadow-color': lineColor, boxShadow: `0 0 10px var(--tw-shadow-color)` } as CSSProperties}
                aria-label={`Station ${stop.name}`}
            >
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: lineColor }}>
                    {stop.status === 'completed' && <span className="text-white text-xs font-bold">✔</span>}
                </div>
            </button>
            <div
                className="rounded-lg px-3 py-1"
                style={{ backgroundColor: darkenHexColor(lineColor, 40) }}
            >
                <span className="text-sm font-semibold text-white">{stop.name}</span>
            </div>
        </div>
    </div>
);

interface SubwayMapProps {
    lines: SubwayLine[];
    selectedLine: SubwayLine;
    stationStops: SubwayStop[];
    onSelectLine: (line: SubwayLine) => void;
    onNodeClick: (stop: SubwayStop) => void;
}

export const SubwayMap: FC<SubwayMapProps> = ({ lines, selectedLine, stationStops, onSelectLine, onNodeClick }) => {
    return (
        <div className="h-full flex flex-col">
            <LineSelector lines={lines} selectedLine={selectedLine} onSelectLine={onSelectLine} />
            <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#1a202c] relative">
                <div className="relative w-full max-w-sm mx-auto py-8">
                    <div
                        className="absolute top-0 bottom-0 left-1/4 -translate-x-1/2 w-2 rounded-full"
                        style={{ backgroundColor: selectedLine.color }}
                    ></div>
                    {stationStops.map(stop => (
                        <StationNode key={stop.id} stop={stop} lineColor={selectedLine.color} onNodeClick={onNodeClick} />
                    ))}
                </div>
            </main>
        </div>
    );
};