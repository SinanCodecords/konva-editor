import Konva from "konva";

export interface EditableTextProps {
    textElement: TextElement;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onTransform: (node: Konva.Text) => void;
    onSelect: () => void;
    transformerRef: React.RefObject<Konva.Transformer | null> | null;
    onClose: () => void;
}

export type TextStyle = "bold" | "normal" | "italic";
export type TextAlign = "left" | "center" | "right";

export type ElementStyles = {
    fontSize: number;
    fontFamily: string;
    fill: string;
    fontStyle: TextStyle;
    align: TextAlign;
}

export interface TextControlsProps {
    textContent: string;
    setTextContent: (text: string) => void;
    handleControlFocusOut: () => void;
    textStyle: ElementStyles;
    handleStyleChange: (key: string, value: any) => void;
    makeCaps: () => void;
    changeTextStyle: (text: TextStyle) => void;
    changeTextAlign: (align: TextAlign) => void;
}

export interface TextElement {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    rotation: number;
    scaleX: number;
    scaleY: number;
    isSelected: boolean;
    fontStyle: TextStyle;
    align: TextAlign;
}

export interface StickerControlsProps {
    availableStickers: { name: string; src: string; }[];
    addSticker: (src: string) => void;
    addAvailableSticker: (src: string) => void;
}

export interface StickerElement {
    id: string;
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    isSelected: boolean;
}

export interface EditableStickerProps {
    stickerElement: StickerElement;
    stickerImage: HTMLImageElement;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onTransform: (node: Konva.Image) => void;
    onSelect: () => void;
    transformerRef: React.RefObject<Konva.Transformer | null> | null;
    onStickerRemove: (id: string) => void;
}

export interface XButtonProps {
    x: number;
    y: number;
    size?: number;
    onClick: () => void;
    onTap: () => void;
    isSelected: boolean;
}
