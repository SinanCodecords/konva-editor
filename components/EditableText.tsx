import { useEffect, useRef } from "react";
import { Text, Transformer, Group, Rect } from "react-konva";
import Konva from "konva";
import { EditableTextProps } from "@/types";
import useDeleteKeyboardShortcuts from "@/hooks/useDeleteKeyboardShortcuts";

const EditableText = ({
    textElement,
    onDragEnd,
    onTransform,
    onSelect,
    transformerRef,
    onClose
}: EditableTextProps) => {
    useDeleteKeyboardShortcuts()
    const textRef = useRef<Konva.Text>(null);

    useEffect(() => {
        if (transformerRef?.current && textRef.current && textElement.isSelected) {
            transformerRef.current.nodes([textRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [textElement.isSelected, transformerRef]);

    const handleTransformEnd = () => {
        if (textRef.current) {
            const node = textRef.current;
            onTransform(node);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const baseTextWidth = textRef.current?.width() || 0;
    const scaledTextWidth = baseTextWidth * textElement.scaleX;

    const xSize = 20;
    const xOffset = 5;

    const x = textElement.x + scaledTextWidth + xOffset;
    const y = textElement.y - xOffset;

    return (
        <>
            <Group>
                <Text
                    ref={textRef}
                    id={textElement.id}
                    text={textElement.text}
                    x={textElement.x}
                    y={textElement.y}
                    fontSize={textElement.fontSize}
                    fontFamily={textElement.fontFamily}
                    fill={textElement.fill}
                    rotation={textElement.rotation}
                    scaleX={textElement.scaleX}
                    scaleY={textElement.scaleY}
                    draggable={true}
                    onDragEnd={onDragEnd}
                    onTransformEnd={handleTransformEnd}
                    onClick={onSelect}
                    onTap={onSelect}
                    shadowColor={textElement.isSelected ? "#4A90E2" : "transparent"}
                    shadowBlur={textElement.isSelected ? 5 : 0}
                    shadowOpacity={textElement.isSelected ? 0.3 : 0}
                />
                {textElement.isSelected && (
                    <Group x={x} y={y} onClick={handleClose} onTap={handleClose}>
                        <Rect
                            width={xSize}
                            height={xSize}
                            strokeWidth={1.5}
                            stroke="#ff0000"
                            cornerRadius={4}
                            shadowBlur={2}
                            shadowColor="#000000"
                            shadowOpacity={0.2}
                            opacity={0.9}
                        />
                        <Text
                            text="×"
                            fontSize={16}
                            fill="#ff0000"
                            width={xSize}
                            height={xSize}
                            align="center"
                            verticalAlign="middle"
                            fontStyle="bold"
                        />
                    </Group>
                )}
            </Group>
            {textElement.isSelected && transformerRef && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    rotateEnabled={true}
                    borderStroke="#4A90E2"
                    borderStrokeWidth={2}
                    anchorFill="#4A90E2"
                    anchorStroke="#4A90E2"
                    anchorSize={8}
                    keepRatio={false}
                    centeredScaling={false}
                />
            )}
        </>
    );
};

export default EditableText;