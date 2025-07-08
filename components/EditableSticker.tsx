import type React from "react";
import { useEffect, useRef } from "react";
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
    // for keyboard events
    useDelete();
    const groupRef = useRef<Konva.Group>(null);

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

    const getXButtonPosition = () => {
        if (!groupRef.current) {
            return { x: stickerElement.x, y: stickerElement.y };
        }

        const group = groupRef.current;
        const clientRect = group.getClientRect();

        const transformerPadding = 20;

        const x = clientRect.x + clientRect.width + transformerPadding - 10;
        const y = clientRect.y - transformerPadding + 7;

        return { x, y };
    };

    const xButtonPos = getXButtonPosition();

    return (
        <>
            <Group ref={groupRef}>
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
            {stickerElement.isSelected && transformerRef && (
                <XButton
                    x={xButtonPos.x}
                    y={xButtonPos.y}
                    isSelected={stickerElement.isSelected}
                    onClick={() => onStickerRemove(stickerElement.id)}
                    onTap={() => onStickerRemove(stickerElement.id)}
                />
            )}
        </>
    );
};

export default EditableSticker;