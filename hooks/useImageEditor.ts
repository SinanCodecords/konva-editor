import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import { useTextEditor } from './useTextEdititor';
import { useStickerEditor } from './useStickerEditor';
import { useEditorStore } from '@/lib/store';

export const useImageEditor = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const { bgImageObj, setBgImageObj } = useEditorStore();

    useEffect(() => {
        const bgImg = new window.Image();
        bgImg.src = '/bg.jpg';
        bgImg.crossOrigin = 'anonymous';
        bgImg.onload = () => {
            setBgImageObj(bgImg);
        };
    }, [setBgImageObj]);

    const {
        textElements,
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
        handleTextInputBlur,
        changeTextStyle,
    } = useTextEditor();

    const {
        stickers,
        setStickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        setSelectedStickerId,
        handleStickerRemove,
    } = useStickerEditor();

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target._id === 3 && e.target.getStage()?._id === 1) {
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
        const link = document.createElement('a');
        link.download = 'composition.png';
        link.href = dataURL;
        link.click();
    };

    return {
        stageRef,
        transformerRef,
        textElements,
        previewTextElement,
        currentTextInput,
        setTextContent,
        handleTextDragEnd: (id: string, e: Konva.KonvaEventObject<DragEvent>) => handleTextDragEnd(id, e),
        handleTextTransform: (id: string, node: Konva.Text) => handleTextTransform(id, node),
        handleTextSelect: (id: string) => handleTextSelect(id),
        removeText: () => removeText(),
        handleStyleChange,
        makeCaps,
        handleTextInputBlur,
        textStyle: getCurrentTextStyle(),
        handleStageClick,
        downloadImage,
        bgImageObj,
        stickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStickerRemove,
        changeTextStyle
    };
};