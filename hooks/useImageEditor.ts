import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import { useEditorStore } from '@/hooks/useEditorStore';
import useStickerEditor from './useStickerEditor';
import useTextEditor from './useTextEditor';

const useImageEditor = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const { bgImageObj, setBgImageObj, setTextElements } = useEditorStore();

    // Effect to load the background image once the component mounts.
    // It creates a new Image object, sets its source, and once loaded,
    // updates the global state with the image object.
    useEffect(() => {
        const bgImg = new window.Image();
        bgImg.src = '/bg.jpg';
        bgImg.crossOrigin = 'anonymous'; // Enables cross-origin image loading.
        bgImg.onload = () => {
            setBgImageObj(bgImg);
        };
    }, [setBgImageObj]);

    // Destructuring all the necessary text editing functionalities from the `useTextEditor` hook.
    const {
        textElements,
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
        changeTextStyle,
        changeTextAlign,
        controlsRef,
        handleTextDragStart
    } = useTextEditor();

    // Destructuring all the necessary sticker editing functionalities from the `useStickerEditor` hook.
    const {
        stickers,
        setStickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStickerRemove,
        handleStickerDragStart
    } = useStickerEditor();

    /**
     * Handles clicks on the stage. When the stage background is clicked,
     * it deselects all text and sticker elements, effectively clearing any active selections.
     * This is determined by checking the target of the click event.
     * Note: This assumes the stage has the name 'stage'.
     *
     * @param e - The Konva event object, which provides details about the click event.
     */
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // The logic checks if the click target is the stage itself.
        if (e.target.name() === 'stage') {
            deselectAll(); // Deselects all text elements.
            setStickers((prev) =>
                prev.map((sticker) => ({
                    ...sticker,
                    isSelected: false, // Deselects all sticker elements.
                }))
            );
            // Clears the transformer nodes to remove any transformation controls.
            if (transformerRef.current) {
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer()?.batchDraw();
            }
        }
    };

    /**
     * Triggers the download of the current canvas content as a PNG image.
     * Before exporting, it ensures no elements are selected to avoid including
     * selection borders or transformers in the final image. A timeout is used
     * to allow the canvas to redraw before generating the data URL.
     */
    const downloadImage = () => {
        if (!stageRef.current) return;

        // Deselect all text and sticker elements.
        setTextElements((prev) =>
            prev.map((el) => ({ ...el, isSelected: false }))
        );
        setStickers((prev) =>
            prev.map((sticker) => ({ ...sticker, isSelected: false }))
        );

        // Clear the transformer.
        if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }

        // A short timeout to ensure the canvas is updated before exporting.
        setTimeout(() => {
            if (stageRef.current) {
                stageRef.current.batchDraw();

                // Generate a data URL with a higher pixel ratio for better quality.
                const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

                // Create a temporary link to trigger the download.
                const link = document.createElement('a');
                link.download = 'composition.png';
                link.href = dataURL;
                link.click();
            }
        }, 100);
    };

    return {
        stageRef,
        transformerRef,
        textElements,
        currentTextInput,
        setTextContent,
        handleTextDragEnd,
        handleTextTransform: (id: string, node: Konva.Text) => handleTextTransform(id, node),
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
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
        changeTextStyle,
        changeTextAlign,
        controlsRef,
        handleTextDragStart,
        handleStickerDragStart
    };
};

export default useImageEditor;