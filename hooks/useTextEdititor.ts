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
        previewTextElement,
        setPreviewTextElement,
        maxZIndex,
        setMaxZIndex,
        bringToFront,
        clearSelectedStickers
    } = useEditorStore();

    const controlsRef = useRef<HTMLDivElement>(null);

    const selectedTextElement = textElements.find((el) => el.id === selectedElementId) || null;

    const createLiveTextElement = (text: string) => {
        if (!text.trim()) return null;

        const newZIndex = maxZIndex + 1;
        const newElement: TextElement = {
            id: `text-${Date.now()}-${Math.random()}`,
            text: text.trim(),
            x: 200,
            y: 200,
            ...DEFAULT_TEXT_STYLE,
            zIndex: newZIndex,
            isSelected: false,
        };

        return newElement;
    };

    const commitTextElement = (element: TextElement) => {
        setTextElements((prev) => [...prev, element]);
        setSelectedElementId(element.id);
        setMaxZIndex(element.zIndex);
        setPreviewTextElement(null);

        setTimeout(() => {
            updateTextElement(element.id, { isSelected: true });
        }, 0);
    };

    const changeTextStyle = (style: TextStyle) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { fontStyle: style });
        } else if (previewTextElement) {
            const updatedPreview = { ...previewTextElement, fontStyle: style };
            setPreviewTextElement(updatedPreview);
        }
    };

    const changeTextAlign = (align: TextAlign) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { align });
        } else if (previewTextElement) {
            const updatedPreview = { ...previewTextElement, align };
            setPreviewTextElement(updatedPreview);
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
                const liveElement = createLiveTextElement(text);
                if (liveElement) {
                    setPreviewTextElement(liveElement);
                }
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

        if (previewTextElement && currentTextInput.trim()) {
            commitTextElement(previewTextElement);
        } else {
            setCurrentTextInput('');
            setSelectedElementId(null);
            setPreviewTextElement(null);
        }
    };

    const handleStyleChange = (key: string, value: any) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { [key]: value });
        } else if (previewTextElement) {
            const updatedPreview = { ...previewTextElement, [key]: value };
            setPreviewTextElement(updatedPreview);
        }
    };

    const handleTextDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        const updates = {
            x: e.target.x(),
            y: e.target.y(),
        };

        if (id === 'preview' && previewTextElement) {
            const updatedPreview = { ...previewTextElement, ...updates };
            setPreviewTextElement(updatedPreview);
        } else {
            updateTextElement(id, updates);
        }
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

        if (id === 'preview' && previewTextElement) {
            const updatedPreview = { ...previewTextElement, ...updates };
            setPreviewTextElement(updatedPreview);
        } else {
            updateTextElement(id, updates);
        }
    };

    const handleTextSelect = (id: string) => {
        setTextElements((prev) => prev.map((el) => ({ ...el, isSelected: false })));
        clearSelectedStickers();

        if (id === 'preview' && previewTextElement) {
            commitTextElement(previewTextElement);
        } else {
            setSelectedElementId(id);
            updateTextElement(id, { isSelected: true });

            const element = textElements.find((el) => el.id === id);
            if (element) {
                setCurrentTextInput(element.text);
            }

            bringToFront(id, 'text');
        }
    };

    const removeText = (id?: string) => {
        const targetId = id || selectedElementId;

        if (id === "preview" || (targetId === null && previewTextElement)) {
            setPreviewTextElement(null);
            setCurrentTextInput('');
            return;
        }

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
        const uppercaseText = currentTextInput.toUpperCase();
        setCurrentTextInput(uppercaseText);

        if (selectedElementId) {
            updateTextElement(selectedElementId, { text: uppercaseText });
        } else if (previewTextElement) {
            const updatedPreview = { ...previewTextElement, text: uppercaseText };
            setPreviewTextElement(updatedPreview);
        }
    };

    const deselectAll = () => {
        setTextElements((prev) => prev.map((el) => ({ ...el, isSelected: false })));
        setSelectedElementId(null);

        if (previewTextElement && currentTextInput.trim()) {
            commitTextElement(previewTextElement);
        } else {
            setPreviewTextElement(null);
            setCurrentTextInput('');
        }
    };

    const getCurrentTextStyle = (): ElementStyles => {
        const activeElement = selectedTextElement || previewTextElement;

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