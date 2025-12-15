import { useState, useEffect } from 'react';
import { GenerationParams, ViralTone, ViralFramework, EmojiDensity, PostLength } from '../types';
import { ViralTone as ToneEnum, ViralFramework as FrameworkEnum, PostLength as LengthEnum, EmojiDensity as DensityEnum } from '../types';

interface UseGeneratorFormProps {
    initialTopic?: string;
    initialParams?: GenerationParams | null;
}

export const useGeneratorForm = ({ initialTopic = '', initialParams = null }: UseGeneratorFormProps = {}) => {
    const [params, setParams] = useState<GenerationParams>({
        topic: initialTopic,
        audience: '',
        tone: 'random',
        framework: 'random',
        length: 'random',
        creativityLevel: 50,
        emojiDensity: 'random',
        hashtagCount: 3,
        hookStyle: 'random',
        includeCTA: true,
    });

    // Load saved params on mount
    useEffect(() => {
        const savedParams = localStorage.getItem('kolink_generator_params');
        if (savedParams && !initialParams && !initialTopic) {
            try {
                setParams(JSON.parse(savedParams));
            } catch (e) {
                console.error("Failed to parse saved params", e);
            }
        }
    }, []);

    // Save params to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('kolink_generator_params', JSON.stringify(params));
    }, [params]);

    // Effect to update params if initialParams provided
    useEffect(() => {
        if (initialParams) {
            setParams(initialParams);
        }
    }, [initialParams]);

    // Effect to update topic if initialTopic changes
    useEffect(() => {
        if (initialTopic) {
            setParams(prev => ({ ...prev, topic: initialTopic }));
        }
    }, [initialTopic]);

    const updateParams = (newParams: Partial<GenerationParams>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    return {
        params,
        updateParams,
        setParams
    };
};
