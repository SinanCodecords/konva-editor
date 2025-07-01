import { useState } from "react";
import type Konva from "konva";

export interface TextElement {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    rotation: number;
    isSelected: boolean;
}

export const useTextEditor = () => {
    const DEFAULT_TEXT = {
        text: "",
        x: 200,
        y: 200,
        fontSize: 30,
        fontFamily: "Arial",
        fill: "#000000",
        rotation: 0,
        isSelected: false,
    };

    const [textElement, setTextElement] = useState<TextElement | null>(null);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [textStyle, setTextStyle] = useState({
        fontSize: 30,
        fontFamily: "Arial",
        fill: "#000000",
    });

    const handleStyleChange = (key: string, value: any) => {
        setTextStyle((prev) => ({ ...prev, [key]: value }));
        if (textElement) {
            setTextElement((prev) => prev ? { ...prev, [key]: value } : prev);
        }
    };

    const setTextContent = (text: string) => {
        if (text.trim()) {
            setTextElement((prev) => ({
                ...(prev || DEFAULT_TEXT),
                text,
            }));
        } else {
            setTextElement(null);
        }
    };

    const handleTextDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setTextElement((prev) => prev ? { ...prev, x: e.target.x(), y: e.target.y() } : prev);
    };

    const handleTextTransform = (node: Konva.Text) => {
        setTextElement((prev) =>
            prev
                ? {
                    ...prev,
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    fontSize: Math.max(10, prev.fontSize * node.scaleX()),
                }
                : prev
        );
        if (node) {
            node.scaleX(1);
            node.scaleY(1);
        }
    };

    const handleTextSelect = () => {
        setIsTextSelected(true);
        setTextElement((prev) => prev ? { ...prev, isSelected: true } : prev);
    };

    const removeText = () => {
        setTextElement(null);
        setIsTextSelected(false);
    };

    const makeCaps = () => {
        setTextElement((prev) => prev ? { ...prev, text: prev?.text.toUpperCase() } : prev);
    };

    return {
        textElement,
        setTextContent,
        isTextSelected,
        setIsTextSelected,
        textStyle,
        setTextStyle,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
        setTextElement
    };
};