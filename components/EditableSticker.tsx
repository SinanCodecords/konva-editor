import type React from "react";
import { useEffect } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import type Konva from "konva";

interface StickerElement {
    id: string;
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    isSelected: boolean;
}

interface EditableStickerProps {
    stickerElement: StickerElement;
    stickerImage: HTMLImageElement;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onTransform: (node: Konva.Image) => void;
    onSelect: () => void;
    transformerRef: React.RefObject<Konva.Transformer | null> | null;
}

const EditableSticker = ({
    stickerElement,
    stickerImage,
    onDragEnd,
    onTransform,
    onSelect,
    transformerRef,
}: EditableStickerProps) => {
    useEffect(() => {
        if (transformerRef?.current && stickerElement.isSelected) {
            const stage = transformerRef.current.getStage();
            const node = stage?.findOne(`#${stickerElement.id}`);
            if (node) {
                transformerRef.current.nodes([node]);
                transformerRef.current.getLayer()?.batchDraw();
            }
        }
    }, [stickerElement.isSelected, transformerRef, stickerElement.id]);

    const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
        const node = e.target as Konva.Image;
        onTransform(node);
    };

    return (
        <>
            <KonvaImage
                id={stickerElement.id}
                image={stickerImage}
                x={stickerElement.x}
                y={stickerElement.y}
                rotation={stickerElement.rotation}
                scaleX={stickerElement.scaleX}
                scaleY={stickerElement.scaleY}
                draggable={true}
                onDragEnd={onDragEnd}
                onTransformEnd={handleTransformEnd}
                onClick={onSelect}
                onTap={onSelect}
            />
            {stickerElement.isSelected && transformerRef && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // Prevent sticker from becoming too small
                        if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    enabledAnchors={[
                        "top-left",
                        "top-center",
                        "top-right",
                        "middle-left",
                        "middle-right",
                        "bottom-left",
                        "bottom-center",
                        "bottom-right",
                    ]}
                    rotateEnabled={true}
                    borderStroke="#4A90E2"
                    borderStrokeWidth={2}
                    anchorFill="#4A90E2"
                    anchorStroke="#4A90E2"
                    anchorSize={8}
                />
            )}
        </>
    );
};

export default EditableSticker;