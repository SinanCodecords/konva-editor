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
};

export const useTextEditor = () => {
    const {
        textElements,
        setTextElements,
        selectedElementId,
        setSelectedElementId,
        currentTextInput,
        setCurrentTextInput,
        previewTextElement,
        setPreviewTextElement,
    } = useEditorStore();

    const controlsRef = useRef<HTMLDivElement>(null); 

    const selectedTextElement = textElements.find((el) => el.id === selectedElementId) || null;

    const addTextElement = (text: string) => {
        if (text.trim()) {
            const newElement: TextElement = {
                id: `text-${Date.now()}-${Math.random()}`,
                text: text.trim(),
                x: 200,
                y: 200,
                ...DEFAULT_TEXT_STYLE,
                isSelected: true, 
            };

            setTextElements((prev) => [...prev, newElement]);
            setSelectedElementId(newElement.id);
            setCurrentTextInput('');
            setPreviewTextElement(null);
        }
    };

    const changeTextStyle = (style: TextStyle) => {
        if (selectedElementId) {
            const element = textElements.find((el) => el.id === selectedElementId);
            if (element) {
                updateTextElement(selectedElementId, { fontStyle: style });
            }
        }
    };

    const changeTextAlign = (align: TextAlign) => {
        if (selectedElementId) {
            const element = textElements.find((el) => el.id === selectedElementId);
            if (element) {
                updateTextElement(selectedElementId, { align });
            }
        }
    };

    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        setTextElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
        );
    };

    const setTextContent = (text: string) => {
        setCurrentTextInput(text);

        if (selectedElementId) {
            updateTextElement(selectedElementId, { text });
        } else {
            if (text.trim()) {
                setPreviewTextElement({
                    id: 'preview',
                    text: text.trim(),
                    x: 200,
                    y: 200,
                    ...DEFAULT_TEXT_STYLE,
                    isSelected: false,
                });
            } else {
                setPreviewTextElement(null);
            }
        }
    };

    const handleControlFocusOut = (e: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (controlsRef.current && relatedTarget && controlsRef.current.contains(relatedTarget)) {
            return;
        }

        if (currentTextInput.trim() && !selectedElementId) {
            addTextElement(currentTextInput);
        } else {
            console.log("HERER");

            setCurrentTextInput('');
            setSelectedElementId(null);
            setPreviewTextElement(null);
        }
    };

    const handleStyleChange = (key: string, value: any) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { [key]: value });
        }
    };

    const handleTextDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        updateTextElement(id, {
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleTextTransform = (id: string, node: Konva.Text) => {
        // Extract the transform values safely
        const x = typeof node.x === 'function' ? node.x() : node.x;
        const y = typeof node.y === 'function' ? node.y() : node.y;
        const rotation = typeof node.rotation === 'function' ? node.rotation() : node.rotation;
        const scaleX = typeof node.scaleX === 'function' ? node.scaleX() : node.scaleX;
        const scaleY = typeof node.scaleY === 'function' ? node.scaleY() : node.scaleY;

        updateTextElement(id, {
            x,
            y,
            rotation,
            scaleX,
            scaleY,
        });
    };

    const handleTextSelect = (id: string) => {
        setTextElements((prev) => prev.map((el) => ({ ...el, isSelected: false })));
        setSelectedElementId(id);
        updateTextElement(id, { isSelected: true });
        const element = textElements.find((el) => el.id === id);
        if (element) {
            setCurrentTextInput(element.text);
        }
    };

    const removeText = (id?: string) => {
        const targetId = id || selectedElementId;
        if (targetId) {
            setTextElements((prev) => prev.filter((el) => el.id !== targetId));
            if (selectedElementId === targetId) {
                setSelectedElementId(null);
                setCurrentTextInput('');
                setPreviewTextElement(null);
            }
        }
    };

    const makeCaps = () => {
        if (selectedElementId) {
            const element = textElements.find((el) => el.id === selectedElementId);
            if (element) {
                const uppercaseText = element.text.toUpperCase();
                updateTextElement(selectedElementId, { text: uppercaseText });
                setCurrentTextInput(uppercaseText);
            }
        }
    };

    const deselectAll = () => {
        setTextElements((prev) => prev.map((el) => ({ ...el, isSelected: false })));
        setSelectedElementId(null);
        setPreviewTextElement(null);
        setCurrentTextInput('');
    };

    const getCurrentTextStyle = (): ElementStyles => {
        if (selectedTextElement) {
            return {
                fontSize: selectedTextElement.fontSize,
                fontFamily: selectedTextElement.fontFamily,
                fill: selectedTextElement.fill,
                fontStyle: selectedTextElement.fontStyle,
                align: selectedTextElement.align,
                opacity: selectedTextElement.opacity,
                hasBackground: selectedTextElement.hasBackground,
                backgroundColor: selectedTextElement.backgroundColor,
                backgroundOpacity: selectedTextElement.backgroundOpacity,
                backgroundRadius: selectedTextElement.backgroundRadius,
                hasBorder: selectedTextElement.hasBorder,
                borderColor: selectedTextElement.borderColor,
                borderWidth: selectedTextElement.borderWidth,
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
            borderWidth: DEFAULT_TEXT_STYLE.borderWidth,
        };
    };

    return {
        textElements,
        selectedElementId,
        selectedTextElement,
        previewTextElement,
        currentTextInput,
        setTextContent,
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