"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider, } from "./ui/slider";
import { X } from "lucide-react";

interface TextControlsProps {
    textContent: string;
    setTextContent: (text: string) => void;
    textStyle: {
        fontSize: number;
        fontFamily: string;
        fill: string;
    };
    isTextSelected: boolean;
    onRemoveText: () => void;
    handleStyleChange: (key: string, value: any) => void;
}

const TextControls = ({
    textContent,
    setTextContent,
    textStyle,
    onRemoveText,
    handleStyleChange,
}: TextControlsProps) => {
    const FONT_FAMILIES = [
        "Arial",
        "Helvetica",
        "Times New Roman",
        "Courier New",
        "Verdana",
        "Georgia",
        "Palatino",
        "Garamond",
        "Bookman",
        "Comic Sans MS",
        "Trebuchet MS",
        "Arial Black",
        "Impact",
    ];

    return (
        <div className="p-4 rounded-lg border bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">Text Controls</h3>

            <div className="space-y-4">

                <div>
                    <Label htmlFor="live-text">Text Input</Label>
                    <div className="flex gap-2">
                        <Input
                            id="live-text"
                            type="text"
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder="Type and press Enter to add..."
                            className="mt-1"
                        />
                        <Button onClick={onRemoveText} variant={"default"} disabled={!textContent.trim()} className="mt-1 ">
                            <X />
                        </Button>
                    </div>
                </div>

                <div>
                    <Label>Font Family</Label>
                    <Select
                        value={textStyle.fontFamily}
                        onValueChange={(value) => handleStyleChange("fontFamily", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FONT_FAMILIES.map((font) => (
                                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                    {font}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Font Size: {Math.round(textStyle.fontSize)}px</Label>
                    <Slider
                        value={[textStyle.fontSize]}
                        onValueChange={([value]) => handleStyleChange("fontSize", value)}
                        min={12}
                        max={100}
                        step={1}
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label>Text Color</Label>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                value={textStyle.fill}
                                onChange={(e) => handleStyleChange("fill", e.target.value)}
                                className="w-16 h-8 p-0 border-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextControls;