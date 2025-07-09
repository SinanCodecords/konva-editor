import { useMemo, useRef } from 'react';
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
        currentTextInput,
        setCurrentTextInput,
        maxZIndex,
        setMaxZIndex,
        bringToFront,
        clearSelectedStickers,
        update
    } = useEditorStore();

    const controlsRef = useRef<HTMLDivElement>(null);

    const selectedTextElement = useMemo(() => textElements.find((el) => el.isSelected) || null, [textElements]);

    const select = (id: string) => {
        let text = "";
        setTextElements((prev) =>
            prev.map((el) => {
                const isSelected = el.id === id;
                if (!text) {
                    text = isSelected ? el.text : "";
                };
                return {
                    ...el,
                    isSelected
                };
            })
        );
        setCurrentTextInput(text!);
    }

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
        setTextElements((prev) => {
            return [...prev.map(el => ({ ...el, isSelected: false })), newElement];
        });
        setMaxZIndex(newZIndex);
        return newElement;
    };

    const changeTextStyle = (style: TextStyle) => {
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { fontStyle: style });
        }
    };

    const changeTextAlign = (align: TextAlign) => {
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { align });
        }
    };

    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        setTextElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
        );
    };


    const setTextContent = (text: string) => {

        clearSelectedStickers();

        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            setCurrentTextInput(text);
            updateTextElement(selected.id, { text });
        } else if (text.trim()) {
            createNewTextElement(text);
        }
    };

    const handleControlFocusOut = (e: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = e.relatedTarget;
        if (controlsRef.current && relatedTarget && controlsRef.current.contains(relatedTarget)) {
            return;
        }

        const selected = textElements.find((el) => el.isSelected);
        if (selected && !currentTextInput.trim()) {
            removeText(selected.id);
        }

        setCurrentTextInput('');
        deselectAll();
    };

    const handleStyleChange = (key: string, value: any) => {
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { [key]: value });
        }
    };

    const handleTextDragStart = (id: string) => {
        const element = textElements.find((el) => el.id === id);
        if (element && !element.isSelected) {
            select(id)
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
        clearSelectedStickers();

        select(id)
        bringToFront(id, 'text');
    };

    const removeText = (id?: string) => {
        const targetId = id || textElements.find((el) => el.isSelected)?.id;

        if (targetId) {
            setTextElements((prev) => prev.filter((el) => el.id !== targetId));
            update({ currentTextInput: "" });
        }
    };

    const makeCaps = () => {
        const uppercaseText = currentTextInput.toUpperCase();
        setCurrentTextInput(uppercaseText);

        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { text: uppercaseText });
        }
    };

    const deselectAll = () => {
        setTextElements((prev) =>
            prev.map((el) => ({ ...el, isSelected: false }))
        );

        const selected = textElements.find((el) => el.isSelected);
        if (selected && !selected.text.trim()) {
            removeText(selected.id);
        }

        setCurrentTextInput('');
    };

    const getCurrentTextStyle = (): ElementStyles => {
        const activeElement = textElements.find((el) => el.isSelected);

        const textElement = activeElement || DEFAULT_TEXT_STYLE;

        return {
            fontSize: textElement.fontSize,
            fontFamily: textElement.fontFamily,
            fill: textElement.fill,
            fontStyle: textElement.fontStyle,
            align: textElement.align,
            opacity: textElement.opacity,
            hasBackground: textElement.hasBackground,
            backgroundColor: textElement.backgroundColor,
            backgroundOpacity: textElement.backgroundOpacity,
            backgroundRadius: textElement.backgroundRadius,
            hasBorder: textElement.hasBorder,
            borderColor: textElement.borderColor,
            borderWidth: textElement.borderWidth,
            zIndex: textElement.zIndex,
        };
    };


    return {
        textElements,
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