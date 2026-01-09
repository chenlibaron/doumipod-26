import React, { useState, useCallback } from 'react';

// A generic hook for fetching data from an async function (like our AI services)
// It manages loading, error, and data states.
export const useAIFetch = (
    fetchFunction
) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setIsLoading(true);
        setError(null);
        setData(null); // Clear previous data on new fetch
        try {
            const result = await fetchFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            console.error('AI Fetch Hook Error:', err);
            setError('An error occurred while fetching data. Please try again.');
            // Re-throw to allow component-specific error handling if needed
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchFunction]);

    return { data, isLoading, error, execute, setData };
};