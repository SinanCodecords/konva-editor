import { useState } from "react";
import type Konva from "konva";

export const useStickerEditor = () => {
    const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
    const [stickers, setStickers] = useState<any[]>([]);
    const [availableStickers, setAvailableStickers] = useState([
        { name: "Sticker 1", src: "/sticker.svg" },
    ]);

    const addSticker = (src: string) => {
        setStickers((prev) => [
            ...prev,
            {
                id: `sticker-${Date.now()}`,
                x: 100,
                y: 100,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                isSelected: false,
                src,
            },
        ]);
    };

    const addAvailableSticker = (src: string) => {
        setAvailableStickers((prev) => [
            ...prev,
            { name: `Sticker ${prev.length + 1}`, src },
        ]);
    };

    const handleStickerDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        setStickers((prev) =>
            prev.map((sticker) => (sticker.id === id ? { ...sticker, x: e.target.x(), y: e.target.y() } : sticker))
        );
    };

    const handleStickerTransform = (id: string, node: Konva.Image) => {
        setStickers((prev) =>
            prev.map((sticker) =>
                sticker.id === id
                    ? {
                        ...sticker,
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                    }
                    : sticker
            )
        );
    };

    const handleStickerSelect = (id: string) => {
        setSelectedStickerId(id);
        setStickers((prev) =>
            prev.map((sticker) => ({
                ...sticker,
                isSelected: sticker.id === id,
            }))
        );
    };

    return {
        stickers,
        setStickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        selectedStickerId,
        setSelectedStickerId,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
    };
};