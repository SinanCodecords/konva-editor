import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { temporal } from 'zundo';
import { StickerElement, TextElement } from '@/types';


interface StoreState {
    stickers: StickerElement[];
    availableStickers: { name: string; src: string; }[];
    selectedStickerId: string | null;
    textElements: TextElement[];
    selectedElementId: string | null;
    currentTextInput: string;
    previewTextElement: TextElement | null;
    bgImageObj: HTMLImageElement | null;
    maxZIndex: number;
    setStickers: (stickers: StickerElement[] | ((prev: StickerElement[]) => StickerElement[])) => void;
    setAvailableStickers: (
        stickers: { name: string; src: string; }[] | ((prev: { name: string; src: string; }[]) => { name: string; src: string; }[])
    ) => void;
    setSelectedStickerId: (id: string | null) => void;
    setTextElements: (elements: TextElement[] | ((prev: TextElement[]) => TextElement[])) => void;
    setSelectedElementId: (id: string | null) => void;
    setCurrentTextInput: (text: string) => void;
    setPreviewTextElement: (element: TextElement | null) => void;
    setBgImageObj: (image: HTMLImageElement | null) => void;
    bringToFront: (elementId: string, elementType: 'text' | 'sticker') => void;
    setMaxZIndex: (zIndex: number) => void;
}

export const useEditorStore = create<StoreState>()(
    subscribeWithSelector(
        temporal(
            (set, get) => ({
                stickers: [],
                availableStickers: [
                    { name: 'Sticker ', src: '/sticker.svg' },
                    { name: 'Sticker s', src: '/s.svg' },
                    { name: 'Sticker 1', src: '/1.svg' },
                    { name: 'Sticker 2', src: '/2.svg' },
                    { name: 'Sticker 3', src: '/3.svg' },
                    { name: 'Sticker 4', src: '/4.svg' },
                    { name: 'Sticker 5', src: '/5.svg' },
                    { name: 'Sticker 6', src: '/6.svg' },
                ],
                selectedStickerId: null,
                textElements: [],
                selectedElementId: null,
                currentTextInput: '',
                previewTextElement: null,
                bgImageObj: null,
                maxZIndex: 0,
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
                setMaxZIndex: (zIndex) => set({ maxZIndex: zIndex }),
                bringToFront: (elementId, elementType) => {
                    const state = get();
                    const newZIndex = state.maxZIndex + 1;

                    if (elementType === 'text') {
                        set({
                            textElements: state.textElements.map(el =>
                                el.id === elementId ? { ...el, zIndex: newZIndex } : el
                            ),
                            maxZIndex: newZIndex
                        });
                    } else if (elementType === 'sticker') {
                        set({
                            stickers: state.stickers.map(sticker =>
                                sticker.id === elementId ? { ...sticker, zIndex: newZIndex } : sticker
                            ),
                            maxZIndex: newZIndex
                        });
                    }
                }
            }),
            {
                partialize: (state) => ({
                    stickers: state.stickers,
                    textElements: state.textElements,
                    maxZIndex: state.maxZIndex,
                }),
                limit: 50,
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