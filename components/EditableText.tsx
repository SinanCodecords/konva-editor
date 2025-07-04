import { useEffect, useRef } from "react";
import { Text, Transformer, Group } from "react-konva";
import Konva from "konva";
import { EditableTextProps } from "@/types";
import useDelete from "@/hooks/keyboardShortcuts/useDelete";
import XButton from "./XButton";

const EditableText = ({
    textElement,
    onDragEnd,
    onTransform,
    onSelect,
    transformerRef,
    onClose
}: EditableTextProps) => {
    // for keyboard events
    useDelete();
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
                    fontStyle={textElement.fontStyle}
                    opacity={textElement.opacity}
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
                <XButton
                    x={x}
                    y={y}
                    size={xSize}
                    isSelected={textElement.isSelected}
                    onClick={onClose}
                    onTap={onClose}
                />
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