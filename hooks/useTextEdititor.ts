import { useRef } from 'react';
import type Konva from 'konva';
import { ElementStyles, TextAlign, TextElement, TextStyle } from '@/types';
import { useEditorStore } from '@/lib/store';

const DEFAULT_TEXT_STYLE = {
    fontSize: 30,
    fontFamily: 'Arial',
    fill: '#000000',
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    fontStyle: 'normal' as TextStyle,
    align: "center" as TextAlign,
    opacity: 1,
    hasBackground: false,
    backgroundColor: '#ffffff',
    backgroundOpacity: 0.8,
    backgroundRadius: 0,
    hasBorder: false,
    borderColor: '#000000',
    borderWidth: 2,
    zIndex: 0,
};

export const useTextEditor = () => {
    const {
        textElements,
        setTextElements,
        selectedElementId,
        setSelectedElementId,
        currentTextInput,
        setCurrentTextInput,
        maxZIndex,
        setMaxZIndex,
        bringToFront,
        clearSelectedStickers,
        update
    } = useEditorStore();

    const controlsRef = useRef<HTMLDivElement>(null);

    const selectedTextElement = textElements.find((el) => el.id === selectedElementId) || null;

    const createNewTextElement = (text: string) => {
        const newZIndex = maxZIndex + 1;
        const newElement: TextElement = {
            id: `text-${Date.now()}-${Math.random()}`,
            text: text,
            x: 200,
            y: 200,
            ...DEFAULT_TEXT_STYLE,
            zIndex: newZIndex,
            isSelected: true,
        };
        setSelectedElementId(newElement.id);
        setMaxZIndex(newZIndex);
        setTextElements((prev) => {
            return [...prev.map(el => ({ ...el, isSelected: false })), newElement];
        });
        return newElement;
    };

    const changeTextStyle = (style: TextStyle) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { fontStyle: style });
        }
    };

    const changeTextAlign = (align: TextAlign) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { align });
        }
    };

    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        setTextElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : { ...el, isSelected: false }))
        );
    };

    const setTextContent = (text: string) => {
        setCurrentTextInput(text);
        clearSelectedStickers();

        if (selectedElementId) {
            updateTextElement(selectedElementId, { text });
        } else if (text.trim()) {
            createNewTextElement(text);
        }
    };

    const handleControlFocusOut = (e: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = e.relatedTarget;
        if (controlsRef.current && relatedTarget && controlsRef.current.contains(relatedTarget)) {
            return;
        }

        if (selectedElementId && !currentTextInput.trim()) {
            removeText(selectedElementId);
        }

        setCurrentTextInput('');
        setSelectedElementId(null);
    };

    const handleStyleChange = (key: string, value: any) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { [key]: value });
        }
    };

    const handleTextDragStart = (id: string) => {
        const element = textElements.find((el) => el.id === id);
        console.log("CALLED HERE");

        if (element && !element.isSelected) {
            setTextElements((prev) =>
                prev.map((el) => ({
                    ...el,
                    isSelected: el.id === id
                }))
            );
        }
    };

    const handleTextDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        const updates = {
            x: e.target.x(),
            y: e.target.y(),
        };
        updateTextElement(id, updates);
    };

    const handleTextTransform = (id: string, node: Konva.Text) => {
        const x = typeof node.x === 'function' ? node.x() : node.x;
        const y = typeof node.y === 'function' ? node.y() : node.y;
        const rotation = typeof node.rotation === 'function' ? node.rotation() : node.rotation;
        const scaleX = typeof node.scaleX === 'function' ? node.scaleX() : node.scaleX;
        const scaleY = typeof node.scaleY === 'function' ? node.scaleY() : node.scaleY;
        const fontSize = typeof node.fontSize === 'function' ? node.fontSize() : node.fontSize;

        const updates = {
            x,
            y,
            rotation,
            scaleX,
            scaleY,
            fontSize,
        };

        updateTextElement(id, updates);
    };

    const handleTextSelect = (id: string) => {
        setTextElements((prev) =>
            prev.map((el) => ({
                ...el,
                isSelected: el.id === id
            }))
        );
        clearSelectedStickers();

        setSelectedElementId(id);
        const element = textElements.find((el) => el.id === id);
        if (element) {
            setCurrentTextInput(element.text);
        }

        bringToFront(id, 'text');
    };

    const removeText = (id?: string) => {
        const targetId = id || selectedElementId;

        if (targetId) {
            setTextElements((prev) => prev.filter((el) => el.id !== targetId));
            if (selectedElementId === targetId) {
                update({ currentTextInput: "", selectedElementId: null });
            }
        }
    };

    const makeCaps = () => {
        const uppercaseText = currentTextInput.toUpperCase();
        setCurrentTextInput(uppercaseText);

        if (selectedElementId) {
            updateTextElement(selectedElementId, { text: uppercaseText });
        }
    };

    const deselectAll = () => {
        setTextElements((prev) =>
            prev.map((el) => ({ ...el, isSelected: false }))
        );

        if (selectedElementId) {
            const selectedElement = textElements.find(el => el.id === selectedElementId);
            if (selectedElement && !selectedElement.text.trim()) {
                removeText(selectedElementId);
            }
        }

        setSelectedElementId(null);
        setCurrentTextInput('');
    };

    const getCurrentTextStyle = (): ElementStyles => {
        const activeElement = selectedTextElement;

        if (activeElement) {
            return {
                fontSize: activeElement.fontSize,
                fontFamily: activeElement.fontFamily,
                fill: activeElement.fill,
                fontStyle: activeElement.fontStyle,
                align: activeElement.align,
                opacity: activeElement.opacity,
                hasBackground: activeElement.hasBackground,
                backgroundColor: activeElement.backgroundColor,
                backgroundOpacity: activeElement.backgroundOpacity,
                backgroundRadius: activeElement.backgroundRadius,
                hasBorder: activeElement.hasBorder,
                borderColor: activeElement.borderColor,
                borderWidth: activeElement.borderWidth,
                zIndex: activeElement.zIndex
            };
        }

        return {
            fontSize: DEFAULT_TEXT_STYLE.fontSize,
            fontFamily: DEFAULT_TEXT_STYLE.fontFamily,
            fill: DEFAULT_TEXT_STYLE.fill,
            fontStyle: DEFAULT_TEXT_STYLE.fontStyle,
            align: DEFAULT_TEXT_STYLE.align,
            opacity: DEFAULT_TEXT_STYLE.opacity,
            hasBackground: DEFAULT_TEXT_STYLE.hasBackground,
            backgroundColor: DEFAULT_TEXT_STYLE.backgroundColor,
            backgroundOpacity: DEFAULT_TEXT_STYLE.backgroundOpacity,
            backgroundRadius: DEFAULT_TEXT_STYLE.backgroundRadius,
            hasBorder: DEFAULT_TEXT_STYLE.hasBorder,
            borderColor: DEFAULT_TEXT_STYLE.borderColor,
            zIndex: DEFAULT_TEXT_STYLE.zIndex,
            borderWidth: DEFAULT_TEXT_STYLE.borderWidth,
        };
    };

    return {
        textElements,
        selectedElementId,
        selectedTextElement,
        currentTextInput,
        setTextContent,
        handleTextDragStart,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
        deselectAll,
        getCurrentTextStyle,
        handleControlFocusOut,
        changeTextStyle,
        changeTextAlign,
        controlsRef
    };
};