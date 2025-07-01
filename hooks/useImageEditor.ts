import { useEffect, useRef, useState } from "react";
import type Konva from "konva";
import { useTextEditor } from "./useTextEditing";
import { useStickerEditor } from "./useStickerEditing";

export const useImageEditor = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const [bgImageObj, setBgImageObj] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const bgImg = new window.Image();
        bgImg.src = "/bg.jpg";
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            setBgImageObj(bgImg);
        };
    }, []);

    const {
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
    } = useTextEditor();

    const {
        stickers,
        setStickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        selectedStickerId,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        setSelectedStickerId
    } = useStickerEditor();
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("HERE 🟨");
        console.log("STAGE", e.target.getStage());
        console.log("TARGET", e.target);

        if ((e.target._id === 3) && (e.target.getStage()?._id === 1)) {
            console.log("🔴");

            setIsTextSelected(false);
            setSelectedStickerId(null);
            setTextElement((prev) => prev ? { ...prev, isSelected: false } : prev);
            setStickers((prev) =>
                prev.map((sticker) => ({
                    ...sticker,
                    isSelected: false,
                }))
            );
            if (transformerRef.current) {
                console.log("HERE ❌");
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer()?.batchDraw();
            }
        }
    };

    const downloadImage = () => {
        if (!stageRef.current) return;

        if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }

        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement("a");
        link.download = "composition.png";
        link.href = dataURL;
        link.click();
    };

    return {
        stageRef,
        transformerRef,
        textElement,
        setTextContent,
        isTextSelected,
        textStyle,
        setTextStyle,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        handleStageClick,
        removeText,
        downloadImage,
        bgImageObj,
        stickers,
        setStickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        selectedStickerId,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStyleChange,
        makeCaps
    };
};