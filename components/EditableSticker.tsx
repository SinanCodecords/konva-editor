import type React from "react";
import { useEffect } from "react";
import { Image as KonvaImage, Transformer, Group } from "react-konva";
import type Konva from "konva";
import { EditableStickerProps } from "@/types";
import useDelete from "@/hooks/keyboardShortcuts/useDelete";
import XButton from "./XButton";

const EditableSticker = ({
    stickerElement,
    stickerImage,
    onDragEnd,
    onTransform,
    onSelect,
    transformerRef,
    onStickerRemove,
}: EditableStickerProps) => {
    // for kyboard events
    useDelete();

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

    // X button positioning
    const xSize = 24;
    const xOffset = 8;
    const x = stickerElement.x + (stickerImage?.width || 80) * stickerElement.scaleX + xOffset;
    const y = stickerElement.y - xOffset;

    return (
        <>
            <Group>
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
                <XButton
                    x={x}
                    y={y}
                    size={xSize}
                    isSelected={stickerElement.isSelected}
                    onClick={() => onStickerRemove(stickerElement.id)}
                    onTap={() => onStickerRemove(stickerElement.id)}
                />
            </Group>
            {stickerElement.isSelected && transformerRef && (
                <Transformer
                    ref={transformerRef}
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