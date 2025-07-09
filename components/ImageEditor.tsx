"use client";

import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { Button } from "./ui/button";
import EditableText from "./EditableText";
import { useImageEditor } from "../hooks/useImageEditor";
import EditableSticker from "./EditableSticker";
import StickerControls from "./StickerControls";
import UndoRedoControls from "./UndoRedoControls";
import useUndoRedoKeyboardShortcuts from "@/hooks/keyboardShortcuts/useUndo";
import TextControls from "./text-controls/TextControls";

const ImageEditor = () => {
    const {
        stageRef,
        transformerRef,
        textElements,
        currentTextInput,
        setTextContent,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        handleStageClick,
        removeText,
        downloadImage,
        bgImageObj,
        stickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStyleChange,
        handleStickerRemove,
        makeCaps,
        textStyle,
        handleControlFocusOut,
        changeTextStyle,
        changeTextAlign,
        controlsRef
    } = useImageEditor();

    // for keyboard events
    useUndoRedoKeyboardShortcuts();

    const getAllElementsSorted = () => {
        const allElements = [
            ...textElements.map(el => ({ ...el, type: 'text' as const })),
            ...stickers.map(sticker => ({ ...sticker, type: 'sticker' as const }))
        ];

        return allElements.sort((a, b) => a.zIndex - b.zIndex);
    };

    const sortedElements = getAllElementsSorted();

    return (
        <div className="p-4 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <TextControls
                        textContent={currentTextInput}
                        setTextContent={setTextContent}
                        handleControlFocusOut={handleControlFocusOut}
                        textStyle={textStyle}
                        handleStyleChange={handleStyleChange}
                        makeCaps={makeCaps}
                        ref={controlsRef}
                        changeTextStyle={changeTextStyle}
                        changeTextAlign={changeTextAlign}
                    />
                    <StickerControls
                        availableStickers={availableStickers}
                        addSticker={addSticker}
                        addAvailableSticker={addAvailableSticker}
                    />

                    <UndoRedoControls />
                </div>

                <div className="lg:col-span-3">
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <Stage
                            width={1024}
                            height={700}
                            ref={stageRef}
                            onClick={handleStageClick}
                            onTap={handleStageClick}
                        >
                            <Layer>
                                {bgImageObj && (
                                    <KonvaImage
                                        image={bgImageObj}
                                        x={0}
                                        y={0}
                                        width={1024}
                                        height={700}
                                        draggable={false}
                                    />
                                )}

                                {sortedElements.map((element) => {
                                    if (element.type === 'sticker') {
                                        return (
                                            <EditableSticker
                                                key={element.id}
                                                stickerElement={element}
                                                stickerImage={(() => {
                                                    const img = new window.Image();
                                                    img.src = element.src;
                                                    img.crossOrigin = "anonymous";
                                                    return img;
                                                })()}
                                                onDragEnd={(e) => handleStickerDragEnd(element.id, e)}
                                                onTransform={(node) => handleStickerTransform(element.id, node)}
                                                onSelect={() => handleStickerSelect(element.id)}
                                                transformerRef={element.isSelected ? transformerRef : null}
                                                onStickerRemove={handleStickerRemove}
                                            />
                                        );
                                    } else {
                                        return (
                                            <EditableText
                                                key={element.id}
                                                textElement={element}
                                                onDragEnd={(e) => handleTextDragEnd(element.id, e)}
                                                onClose={() => removeText()}
                                                onTransform={(node) => handleTextTransform(element.id, node)}
                                                onSelect={() => handleTextSelect(element.id)}
                                                transformerRef={element.isSelected ? transformerRef : null}
                                            />
                                        );
                                    }
                                })}
                            </Layer>
                        </Stage>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={downloadImage} disabled={!bgImageObj}>
                            Download Image
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;