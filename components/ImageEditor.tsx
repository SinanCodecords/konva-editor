"use client";

import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { Button } from "./ui/button";
import TextControls from "./TextControls";
import EditableText from "./EditableText";
import { useImageEditor } from "../hooks/useImageEditor";
import EditableSticker from "./EditableSticker";

const ImageEditor = () => {
    const {
        textElement,
        setTextContent,
        textStyle,
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
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStyleChange,
        isTextSelected,
        selectedStickerId,
    } = useImageEditor();

    return (
        <div className="p-4 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                <div className="lg:col-span-1 space-y-6">
                    <TextControls
                        textContent={textElement?.text || ""}
                        setTextContent={setTextContent}
                        textStyle={textStyle}
                        handleStyleChange={handleStyleChange}
                        isTextSelected={isTextSelected}
                        onRemoveText={removeText}
                    />
                </div>

                <div className="lg:col-span-3">

                    <div className="border rounded-lg overflow-hidden mb-4">
                        <Stage width={1000} height={600} ref={stageRef} onClick={handleStageClick} onTap={handleStageClick}>
                            <Layer>

                                {bgImageObj && (
                                    <KonvaImage image={bgImageObj} x={0} y={0} width={1000} height={600} draggable={false} />
                                )}


                                {stickerObj &&
                                    stickers.map((sticker) => (
                                        <EditableSticker
                                            key={sticker.id}
                                            stickerElement={sticker}
                                            stickerImage={stickerObj}
                                            onDragEnd={(e) => handleStickerDragEnd(sticker.id, e)}
                                            onTransform={(node) => handleStickerTransform(sticker.id, node)}
                                            onSelect={() => handleStickerSelect(sticker.id)}
                                            transformerRef={sticker.isSelected ? transformerRef : null}
                                        />
                                    ))}


                                {textElement && (
                                    <EditableText
                                        textElement={textElement}
                                        onDragEnd={handleTextDragEnd}
                                        onTransform={handleTextTransform}
                                        onSelect={handleTextSelect}
                                        transformerRef={isTextSelected ? transformerRef : null}
                                    />
                                )}
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