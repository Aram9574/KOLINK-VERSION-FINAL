import React from 'react';
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { Type, Image, Shapes, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { CarouselElement } from '@/types/carousel';

const ElementsPanel = () => {
    const { project, updateSlide } = useCarouselStore();
    const activeSlideId = useCarouselStore(state => state.editor.activeSlideId);

    const addTextElement = (type: 'heading' | 'body') => {
        const slide = project.slides.find(s => s.id === activeSlideId);
        if (!slide) return;

        const newElement: CarouselElement = {
            id: uuidv4(),
            type: 'text',
            content: type === 'heading' ? 'New Heading' : 'New Text Block',
            style: {
                fontSize: type === 'heading' ? 64 : 32,
                color: '#000000',
                x: 0,
                y: 0
            }
        };

        const currentElements = slide.elements || [];
        updateSlide(activeSlideId!, { elements: [...currentElements, newElement] });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">Add Elements</h3>
                <p className="text-xs text-slate-500">Drag and drop elements to your slide.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-slate-50 hover:border-brand-200" onClick={() => addTextElement('heading')}>
                    <Type className="w-6 h-6 text-slate-700" />
                    <span className="text-xs font-medium">Heading</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-slate-50 hover:border-brand-200" onClick={() => addTextElement('body')}>
                    <Type className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-medium">Body Text</span>
                </Button>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
                 <p className="text-[10px] text-slate-400 text-center">More elements (Shapes, Images) coming soon.</p>
            </div>
        </div>
    );
};

export default ElementsPanel;
