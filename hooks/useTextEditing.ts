import { useState } from "react";
import type Konva from "konva";
import { TextElement } from "@/types";

const DEFAULT_TEXT_STYLE = {
    fontSize: 30,
    fontFamily: "Arial",    
    fill: "#000000",
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
};

export const useTextEditor = () => {
    const [textElements, setTextElements] = useState<TextElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [currentTextInput, setCurrentTextInput] = useState("");
    const [previewTextElement, setPreviewTextElement] = useState<TextElement | null>(null);

    const selectedTextElement = textElements.find(el => el.id === selectedElementId) || null;

    const addTextElement = (text: string) => {
        if (text.trim()) {
            const newElement: TextElement = {
                id: `text-${Date.now()}-${Math.random()}`,
                text: text.trim(),
                x: 200,
                y: 200,
                ...DEFAULT_TEXT_STYLE,
                isSelected: false
            };

            setTextElements(prev => [...prev, newElement]);
            setSelectedElementId(newElement.id);
            setCurrentTextInput(""); 
            setPreviewTextElement(null); // Clear preview
        }
    };

    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        setTextElements(prev =>
            prev.map(el =>
                el.id === id ? { ...el, ...updates } : el
            )
        );
    };

    const setTextContent = (text: string) => {
        setCurrentTextInput(text);

        // If we have a selected element, update it in real-time
        if (selectedElementId) {
            updateTextElement(selectedElementId, { text });
        } else {
        // If no selected element, show preview
            if (text.trim()) {
                setPreviewTextElement({
                    id: 'preview',
                    text: text.trim(),
                    x: 200,
                    y: 200,
                    ...DEFAULT_TEXT_STYLE,
                    isSelected: false
                });
            } else {
                setPreviewTextElement(null);
            }
        }
    };

    const handleTextInputBlur = () => {
        setCurrentTextInput("");
        if (currentTextInput.trim() && !selectedElementId) {
            addTextElement(currentTextInput);
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
            y: e.target.y()
        });
    };

    const handleTextTransform = (id: string, node: Konva.Text) => {
        updateTextElement(id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
        });
    };

    const handleTextSelect = (id: string) => {
        // Deselect all elements first
        setTextElements(prev =>
            prev.map(el => ({ ...el, isSelected: false }))
        );

        // Select the clicked element
        setSelectedElementId(id);
        updateTextElement(id, { isSelected: true });

        // Set the current text input to the selected element's text
        const element = textElements.find(el => el.id === id);
        if (element) {
            setCurrentTextInput(element.text);
        }
    };

    const removeText = (id?: string) => {
        const targetId = id || selectedElementId;
        if (targetId) {
            setTextElements(prev => prev.filter(el => el.id !== targetId));
            if (selectedElementId === targetId) {
                setSelectedElementId(null);
                setCurrentTextInput("");
            }
        }
    };

    const makeCaps = () => {
        if (selectedElementId) {
            const element = textElements.find(el => el.id === selectedElementId);
            if (element) {
                const uppercaseText = element.text.toUpperCase();
                updateTextElement(selectedElementId, { text: uppercaseText });
                setCurrentTextInput(uppercaseText);
            }
        }
    };

    const deselectAll = () => {
        setTextElements(prev =>
            prev.map(el => ({ ...el, isSelected: false }))
        );
        setSelectedElementId(null);
        setPreviewTextElement(null);
    };

    // Get current text style (from selected element or default)
    const getCurrentTextStyle = () => {
        if (selectedTextElement) {
            return {
                fontSize: selectedTextElement.fontSize,
                fontFamily: selectedTextElement.fontFamily,
                fill: selectedTextElement.fill,
            };
        }
        return {
            fontSize: DEFAULT_TEXT_STYLE.fontSize,
            fontFamily: DEFAULT_TEXT_STYLE.fontFamily,
            fill: DEFAULT_TEXT_STYLE.fill,
        };
    };

    return {
        textElements,
        selectedElementId,
        selectedTextElement,
        previewTextElement,
        currentTextInput,
        setTextContent,
        addTextElement,
        updateTextElement,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
        deselectAll,
        getCurrentTextStyle,
        handleTextInputBlur
    };
};