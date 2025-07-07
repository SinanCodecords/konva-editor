import { Group, Circle, Text } from "react-konva";
import type { XButtonProps } from "@/types";

const XButton = ({ x, y, size = 20, onClick, onTap, isSelected }: XButtonProps) => {
    if (!isSelected) {
        return null;
    }
    return (
        <Group x={x} y={y} onClick={onClick} onTap={onTap}>
            <Circle
                width={size}
                height={size}
                radius={size / 2}
                fill="#000000"
                stroke="#ffffff"
                strokeWidth={1}
                shadowBlur={2}
                shadowColor="#000000"
                shadowOpacity={0.2}
                opacity={0.9}
            />
            <Text
                text="x"
                fontSize={size}
                fill="#ffffff"
                width={size}
                height={size}
                align="center"
                verticalAlign="middle"
                offsetX={size / 2}
                offsetY={size / 2}
            />
        </Group>
    );
};

export default XButton;