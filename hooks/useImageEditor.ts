import { useRef } from "react";
import type Konva from "konva";
import { useTextEditor } from "./useTextEditing";
import { useStickerEditor } from "./useStickerEditing";

export const useImageEditor = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

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
        setSelectedStickerId
    } = useStickerEditor();

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

    const downloadImage = () => {
        if (!stageRef.current) return;

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