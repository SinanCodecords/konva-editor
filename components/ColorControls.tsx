import { useState, useEffect } from "react";
import { ColorControlsProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "./ui/slider";

const ColorControls = ({
    textStyle,
    handleStyleChange
}: ColorControlsProps) => {
    const [colorFormat, setColorFormat] = useState<"string" | "hex" | "rgb">("hex");
    const [inputValue, setInputValue] = useState(textStyle.fill);

    useEffect(() => {
        setInputValue(textStyle.fill);
    }, [textStyle.fill]);

    const colors = [
        "#FF0000",
        "#FFFFFF",
        "#000000",
        "#00FFFF",
        "#00FF00",
        "#FFFF00",
        "#0000FF",
        "#FF6347",
        "#008080",
        "#800080"
    ];

    const handleColorSelect = (color: string) => {
        setInputValue(color);
        handleStyleChange("fill", color);
    };

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        handleStyleChange("fill", value);
    };

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleTextInputBlur = () => {
        handleStyleChange("fill", inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStyleChange("fill", inputValue);
            e.currentTarget.blur();
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">Text Color</Label>
            </div>

            <div className="flex gap-2 items-center flex-wrap">
                <Input
                    type="color"
                    value={textStyle.fill.startsWith('#') ? textStyle.fill : '#000000'}
                    onChange={handleColorPickerChange}
                    className="w-12 h-8 p-0 border-2 rounded-lg cursor-pointer"
                />
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${textStyle.fill === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                            }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                    />
                ))}
            </div>

            <div className="flex gap-2 items-center">
                <Select value={colorFormat} onValueChange={(value: "string" | "hex" | "rgb") => setColorFormat(value)}>
                    <SelectTrigger className="w-24">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hex">Hex</SelectItem>
                        <SelectItem value="rgb">RGB</SelectItem>
                        <SelectItem value="string">String</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleTextInputChange}
                    onBlur={handleTextInputBlur}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                />
            </div>
            <div>
                <Label>Text Opacity</Label>
                <Slider
                    value={[textStyle.opacity]}
                    onValueChange={([value]) => handleStyleChange("opacity", value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="mt-2"
                />
            </div>
        </div>
    );
};

export default ColorControls;