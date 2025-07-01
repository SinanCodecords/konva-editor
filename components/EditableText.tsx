"use client";

import { useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";
import type Konva from "konva";
import type { TextElement } from "../hooks/useTextEditing";

interface EditableTextProps {
    textElement: TextElement;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onTransform: (node: Konva.Text) => void;
    onSelect: () => void;
    transformerRef: React.RefObject<Konva.Transformer | null> | null;
}

const EditableText = ({ textElement, onDragEnd, onTransform, onSelect, transformerRef }: EditableTextProps) => {
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


    return (
        <>
            <Text
                ref={textRef}
                text={textElement.text}
                x={textElement.x}
                y={textElement.y}
                fontSize={textElement.fontSize}
                fontFamily={textElement.fontFamily}
                fill={textElement.fill}
                rotation={textElement.rotation}
                draggable={true}
                onDragEnd={onDragEnd}
                onTransformEnd={handleTransformEnd}
                onClick={onSelect}
                onTap={onSelect}
                shadowColor={textElement.isSelected ? "#4A90E2" : "transparent"}
                shadowBlur={textElement.isSelected ? 5 : 0}
                shadowOpacity={textElement.isSelected ? 0.3 : 0}
            />
            {textElement.isSelected && transformerRef && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // Prevent text from becoming too small
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