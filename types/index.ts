import Konva from "konva";

export interface EditableTextProps {
    textElement: TextElement;
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
    onTransform: (node: Konva.Text) => void;
    onSelect: () => void;
    transformerRef: React.RefObject<Konva.Transformer | null> | null;
    onClose: () => void;
}


export interface TextControlsProps {
    textContent: string;
    setTextContent: (text: string) => void;
    handleTextInputBlur: () => void;
    textStyle: {
        fontSize: number;
        fontFamily: string;
        fill: string;
    };
    handleStyleChange: (key: string, value: any) => void;
    makeCaps: () => void;
    hasSelectedText: boolean;
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
