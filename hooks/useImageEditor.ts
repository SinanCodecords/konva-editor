"use client";

import { useState, useRef, useEffect } from "react";
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

export const useImageEditor = () => {
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

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    const [bgImageObj, setBgImageObj] = useState<HTMLImageElement | null>(null);
    const [stickerObj, setStickerObj] = useState<HTMLImageElement | null>(null);
    const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

    const [stickers, setStickers] = useState([
        {
            id: "main-sticker",
            x: 100,
            y: 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            isSelected: false,
        },
    ]);

    // Handle style changes
    const handleStyleChange = (key: string, value: any) => {
        setTextStyle((prev) => ({ ...prev, [key]: value }));
        if (textElement) {
            setTextElement((prev) => prev ? { ...prev, [key]: value } : prev);
        }
    };

    // Update text content
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

    // Initialize images
    useEffect(() => {
        const bgImg = new window.Image();
        bgImg.src = "/bg.jpg";
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            setBgImageObj(bgImg);
        };

        const stkImg = new window.Image();
        stkImg.src = "/sticker.svg";
        stkImg.crossOrigin = "anonymous";
        stkImg.onload = () => {
            setStickerObj(stkImg);
        };
    }, []);

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
        setSelectedStickerId(null);
        setTextElement((prev) => prev ? { ...prev, isSelected: true } : prev);
        setStickers((prev) =>
            prev.map((sticker) => ({
                ...sticker,
                isSelected: false,
            }))
        );
    };

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === e.target.getStage()) {
            setIsTextSelected(false);
            setSelectedStickerId(null);
            setTextElement((prev) => prev ? { ...prev, isSelected: false } : prev);
            setStickers((prev) =>
                prev.map((sticker) => ({
                    ...sticker,
                    isSelected: false,
                }))
            );
        }
    };

    const removeText = () => {
        setTextElement(null);
        setIsTextSelected(false);
    };

    const downloadImage = () => {
        if (!stageRef.current) return;

        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement("a");
        link.download = "composition.png";
        link.href = dataURL;
        link.click();
    };

    const handleStickerDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        setStickers((prev) =>
            prev.map((sticker) => (sticker.id === id ? { ...sticker, x: e.target.x(), y: e.target.y() } : sticker))
        );
    };

    const handleStickerTransform = (id: string, node: Konva.Image) => {
        setStickers((prev) =>
            prev.map((sticker) =>
                sticker.id === id
                    ? {
                        ...sticker,
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                    }
                    : sticker
            )
        );
    };

    const handleStickerSelect = (id: string) => {
        setSelectedStickerId(id);
        setStickers((prev) =>
            prev.map((sticker) => ({
                ...sticker,
                isSelected: sticker.id === id,
            }))
        );
        setIsTextSelected(false);
        setTextElement((prev) => prev ? { ...prev, isSelected: false } : prev);
    };

    return {
        textElement,
        setTextContent,
        isTextSelected,
        textStyle,
        setTextStyle,
        stageRef,
        transformerRef,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        handleStageClick,
        removeText,
        downloadImage,
        bgImageObj,
        stickerObj,
        stickers,
        selectedStickerId,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStyleChange,
    };
};