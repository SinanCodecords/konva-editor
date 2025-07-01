import { useState, useEffect } from "react";
import type Konva from "konva";

export const useStickerEditor = () => {
    const [bgImageObj, setBgImageObj] = useState<HTMLImageElement | null>(null);
    const [stickerObj, setStickerObj] = useState<HTMLImageElement | null>(null);
    const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

    const [stickers, setStickers] = useState([
        {
            id: "main-sticker",
            x: 100,
            y: 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            isSelected: false,
        },
    ]);

    useEffect(() => {
        const bgImg = new window.Image();
        bgImg.src = "/bg.jpg";
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            setBgImageObj(bgImg);
        };

        const stkImg = new window.Image();
        stkImg.src = "/sticker.svg";
        stkImg.crossOrigin = "anonymous";
        stkImg.onload = () => {
            setStickerObj(stkImg);
        };
    }, []);

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
        bgImageObj,
        stickerObj,
        stickers,
        setStickers,
        selectedStickerId,
        setSelectedStickerId,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
    };
};