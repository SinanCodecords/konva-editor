import type React from "react";
import { useEffect, useRef } from "react";
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
    const stickerRef = useRef<Konva.Image>(null);

    useEffect(() => {
        if (transformerRef?.current && stickerRef.current && stickerElement.isSelected) {
            transformerRef.current.nodes([stickerRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [stickerElement.isSelected, transformerRef]);

    const handleTransformEnd = () => {
        if (stickerRef.current) {
            const node = stickerRef.current;
            onTransform(node);
        }
    };

    return (
        <>
            <KonvaImage
                ref={stickerRef}
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
                shadowColor={stickerElement.isSelected ? "blue" : "transparent"}
                shadowBlur={stickerElement.isSelected ? 10 : 0}
                shadowOpacity={stickerElement.isSelected ? 0.5 : 0}
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
