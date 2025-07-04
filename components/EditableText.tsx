import { useEffect, useRef } from "react";
import { Text, Transformer, Group, Rect } from "react-konva";
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
    const groupRef = useRef<Konva.Group>(null);

    useEffect(() => {
        if (transformerRef?.current && groupRef.current && textElement.isSelected) {
            transformerRef.current.nodes([groupRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [textElement.isSelected, transformerRef]);

    const handleGroupTransformEnd = () => {
        if (groupRef.current && textRef.current) {
            const group = groupRef.current;
            const textNode = textRef.current;

            // Create a mock Konva.Text object with the transformed properties
            const mockTextNode = {
                ...textNode,
                x: () => group.x(),
                y: () => group.y(),
                rotation: () => group.rotation(),
                scaleX: () => group.scaleX(),
                scaleY: () => group.scaleY(),
                width: () => textNode.width() * group.scaleX(),
                height: () => textNode.height() * group.scaleY(),
            } as Konva.Text;

            onTransform(mockTextNode);
        }
    };

    // Calculate text dimensions for background
    const textWidth = textRef.current?.width() || 0;
    const textHeight = textRef.current?.height() || 0;
    const scaledTextWidth = textWidth * textElement.scaleX;

    const backgroundPadding = 8;
    const backgroundWidth = textWidth + (backgroundPadding * 2);
    const backgroundHeight = textHeight + (backgroundPadding * 2);

    const xSize = 20;
    const xOffset = 5;
    const x = textElement.x + scaledTextWidth + xOffset;
    const y = textElement.y - xOffset;

    return (
        <>
            <Group
                ref={groupRef}
                x={textElement.x}
                y={textElement.y}
                rotation={textElement.rotation}
                scaleX={textElement.scaleX}
                scaleY={textElement.scaleY}
                draggable={true}
                onDragEnd={onDragEnd}
                onTransformEnd={handleGroupTransformEnd}
                onClick={onSelect}
                onTap={onSelect}
            >
                {textElement.hasBackground && (
                    <Rect
                        x={-backgroundPadding}
                        y={-backgroundPadding}
                        width={backgroundWidth}
                        height={backgroundHeight}
                        fill={textElement.backgroundColor}
                        opacity={textElement.backgroundOpacity}
                        cornerRadius={textElement.backgroundRadius}
                        shadowColor={textElement.isSelected ? "#4A90E2" : "transparent"}
                        shadowBlur={textElement.isSelected ? 5 : 0}
                        shadowOpacity={textElement.isSelected ? 0.3 : 0}

                        stroke={textElement.hasBorder ? textElement.borderColor : undefined}
                        strokeWidth={textElement.hasBorder ? textElement.borderWidth : 0}
                    />
                )}
                <Text
                    ref={textRef}
                    id={textElement.id}
                    text={textElement.text}
                    x={0}
                    y={0}
                    fontSize={textElement.fontSize}
                    fontFamily={textElement.fontFamily}
                    fill={textElement.fill}
                    fontStyle={textElement.fontStyle}
                    opacity={textElement.opacity}
                    align={textElement.align}

                    stroke={textElement.hasBorder ? textElement.borderColor : undefined}
                    strokeWidth={textElement.hasBorder ? textElement.borderWidth : 0}
                    shadowColor={!textElement.hasBackground && textElement.isSelected ? "#4A90E2" : "transparent"}
                    shadowBlur={!textElement.hasBackground && textElement.isSelected ? 5 : 0}
                />
            </Group>
            <XButton
                x={x}
                y={y}
                size={xSize}
                isSelected={textElement.isSelected}
                onClick={onClose}
                onTap={onClose}
            />
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