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
        handleTextInputBlur,
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
        setSelectedStickerId,
        handleStickerRemove
    } = useStickerEditor();

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // Check if clicked on empty area (stage background)
        if ((e.target._id === 3) && (e.target.getStage()?._id === 1)) {
            // Deselect all elements
            deselectAll();
            setSelectedStickerId(null);
            setStickers((prev) =>
                prev.map((sticker) => ({
                    ...sticker,
                    isSelected: false,
                }))
            );

            if (transformerRef.current) {
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
        // Text-related exports
        textElements,
        previewTextElement,
        selectedElementId,
        selectedTextElement,
        currentTextInput,
        setTextContent,
        addTextElement,
        updateTextElement,
        handleTextDragEnd: (id: string, e: Konva.KonvaEventObject<DragEvent>) => handleTextDragEnd(id, e),
        handleTextTransform: (id: string, node: Konva.Text) => handleTextTransform(id, node),
        handleTextSelect: (id: string) => handleTextSelect(id),
        removeText: () => removeText(),
        handleStyleChange,
        makeCaps,
        handleTextInputBlur,
        textStyle: getCurrentTextStyle(),
        // Stage and general
        handleStageClick,
        downloadImage,
        bgImageObj,
        // Sticker-related exports
        stickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        selectedStickerId,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStickerRemove,
    };
};