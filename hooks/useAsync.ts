import { useState, useCallback } from 'react';

/**
 * Discriminated union for async states
 */
export type AsyncState<T, E = Error> =
    | { status: 'idle'; data: null; error: null }
    | { status: 'loading'; data: null; error: null }
    | { status: 'success'; data: T; error: null }
    | { status: 'error'; data: null; error: E };

/**
 * A generic hook to manage asynchronous operations with a strictly typed state.
 */
export function useAsync<T, E = Error>(initialStatus: 'idle' | 'loading' = 'idle') {
    const [state, setState] = useState<AsyncState<T, E>>({
        status: initialStatus,
        data: null,
        error: null,
    } as any); // Type cast here is internal and safe due to state updates

    const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
        setState({ status: 'loading', data: null, error: null });
        try {
            const response = await asyncFunction();
            setState({ status: 'success', data: response, error: null });
            return response;
        } catch (error) {
            setState({ status: 'error', data: null, error: error as E });
            throw error;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ status: 'idle', data: null, error: null });
    }, []);

    return {
        ...state,
        execute,
        reset,
        isIdle: state.status === 'idle',
        isLoading: state.status === 'loading',
        isSuccess: state.status === 'success',
        isError: state.status === 'error',
    };
}
