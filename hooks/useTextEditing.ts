import { useState } from "react";
import type Konva from "konva";

export interface TextElement {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    rotation: number;
    isSelected: boolean;
}

const DEFAULT_TEXT = {
    text: "",
    x: 200,
    y: 200,
    fontSize: 30,
    fontFamily: "Arial",
    fill: "#000000",
    rotation: 0,
    isSelected: false
};

export const useTextEditor = () => {
    const [selectedTextElement, setSelectedTextElement] = useState<TextElement | null>(null);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [textElements, setTextElements] = useState([]);
    const [textStyle, setTextStyle] = useState({
        fontSize: 30,
        fontFamily: "Arial",
        fill: "#000000",
    });

    const handleStyleChange = (key: string, value: any) => {
        setTextStyle((prev) => ({ ...prev, [key]: value }));
        if (selectedTextElement) {
            setSelectedTextElement((prev) => prev ? { ...prev, [key]: value } : prev);
        }
    };

    const setTextContent = (text: string) => {
        if (text.trim()) {
            setSelectedTextElement((prev) => ({
                ...(prev || DEFAULT_TEXT),
                text,
                id: `text-${new Date()}`
            }));
        } else {
            setSelectedTextElement(null);
        }
    };

    const handleTextDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setSelectedTextElement((prev) => prev ? { ...prev, x: e.target.x(), y: e.target.y() } : prev);
    };

    const handleTextTransform = (node: Konva.Text) => {
        setSelectedTextElement((prev) =>
            prev
                ? {
                    ...prev,
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    scaleX: node.scaleX(),
                    scaleY: node.scaleY(),
                }
                : prev
        );
    };

    const handleTextSelect = () => {
        setIsTextSelected(true);
        setSelectedTextElement((prev) => prev ? { ...prev, isSelected: true } : prev);
    };

    const removeText = () => {
        setSelectedTextElement(null);
        setIsTextSelected(false);
    };

    const makeCaps = () => {
        setSelectedTextElement((prev) => prev ? { ...prev, text: prev?.text.toUpperCase() } : prev);
    };

    return {
        selectedTextElement,
        setTextContent,
        isTextSelected,
        setIsTextSelected,
        textStyle,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
        setSelectedTextElement,
        textElements
    };
};