import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { temporal } from 'zundo';
import { TextElement } from '@/types';

interface StoreState {
    stickers: any[];
    availableStickers: { name: string; src: string; }[];
    selectedStickerId: string | null;
    textElements: TextElement[];
    selectedElementId: string | null;
    currentTextInput: string;
    previewTextElement: TextElement | null;
    bgImageObj: HTMLImageElement | null;
    setStickers: (stickers: any[] | ((prev: any[]) => any[])) => void;
    setAvailableStickers: (
        stickers: { name: string; src: string; }[] | ((prev: { name: string; src: string; }[]) => { name: string; src: string; }[])
    ) => void;
    setSelectedStickerId: (id: string | null) => void;
    setTextElements: (elements: TextElement[] | ((prev: TextElement[]) => TextElement[])) => void;
    setSelectedElementId: (id: string | null) => void;
    setCurrentTextInput: (text: string) => void;
    setPreviewTextElement: (element: TextElement | null) => void;
    setBgImageObj: (image: HTMLImageElement | null) => void;
}

export const useEditorStore = create<StoreState>()(
    subscribeWithSelector(
        temporal(
            (set) => ({
                stickers: [],
                availableStickers: [{ name: 'Sticker 1', src: '/sticker.svg' }],
                selectedStickerId: null,
                textElements: [],
                selectedElementId: null,
                currentTextInput: '',
                previewTextElement: null,
                bgImageObj: null,
                setStickers: (stickers) => set((state) => ({
                    stickers: typeof stickers === 'function' ? stickers(state.stickers) : stickers,
                })),
                setAvailableStickers: (stickers) => set((state) => ({
                    availableStickers: typeof stickers === 'function' ? stickers(state.availableStickers) : stickers,
                })),
                setSelectedStickerId: (id) => set({ selectedStickerId: id }),
                setTextElements: (elements) => set((state) => ({
                    textElements: typeof elements === 'function' ? elements(state.textElements) : elements,
                })),
                setSelectedElementId: (id) => set({ selectedElementId: id }),
                setCurrentTextInput: (text) => set({ currentTextInput: text }),
                setPreviewTextElement: (element) => set({ previewTextElement: element }),
                setBgImageObj: (image) => set({ bgImageObj: image }),
            }),
            {
                // Configure which actions should be tracked for undo/redo
                partialize: (state) => ({
                    stickers: state.stickers,
                    textElements: state.textElements,
                }),
                // Limit the number of undo/redo steps
                limit: 50,
                // Equality check to prevent unnecessary history entries
                equality: (pastState, currentState) =>
                    JSON.stringify(pastState) === JSON.stringify(currentState),
            }
        )
    )
);

export const useUndoRedoStore = () => {
    const { undo, redo, clear } = useEditorStore.temporal.getState();
    return { undo, redo, clear };
};