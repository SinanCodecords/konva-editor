import { useState, useEffect } from "react";
import { ColorControlsProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

import ColorPicker from "./ColorPicker";

const ColorControls = ({
    textStyle,
    handleStyleChange
}: ColorControlsProps) => {
    const [textColorFormat, setTextColorFormat] = useState<"string" | "hex" | "rgb">("hex");
    const [backgroundColorFormat, setBackgroundColorFormat] = useState<"string" | "hex" | "rgb">("hex");
    const [textInputValue, setTextInputValue] = useState(textStyle.fill);
    const [backgroundInputValue, setBackgroundInputValue] = useState(textStyle.backgroundColor);

    useEffect(() => {
        setTextInputValue(textStyle.fill);
    }, [textStyle.fill]);

    useEffect(() => {
        setBackgroundInputValue(textStyle.backgroundColor);
    }, [textStyle.backgroundColor]);

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextInputValue(e.target.value);
    };

    const handleTextInputBlur = () => {
        handleStyleChange("fill", textInputValue);
    };

    const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStyleChange("fill", textInputValue);
            e.currentTarget.blur();
        }
    };

    const handleBackgroundInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBackgroundInputValue(e.target.value);
    };

    const handleBackgroundInputBlur = () => {
        handleStyleChange("backgroundColor", backgroundInputValue);
    };

    const handleBackgroundKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStyleChange("backgroundColor", backgroundInputValue);
            e.currentTarget.blur();
        }
    };

    return (
        <div className="space-y-6">
            {/* Text Color Section */}
            <div className="space-y-4">
                <div>
                    <Label className="text-sm font-medium">Text Color</Label>
                </div>

                <ColorPicker
                    value={textStyle.fill}
                    onChange={(color) => {
                        setTextInputValue(color);
                        handleStyleChange("fill", color);
                    }}
                />

                <div className="flex gap-2 items-center">
                    <Select value={textColorFormat} onValueChange={(value: "string" | "hex" | "rgb") => setTextColorFormat(value)}>
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
                        value={textInputValue}
                        onChange={handleTextInputChange}
                        onBlur={handleTextInputBlur}
                        onKeyDown={handleTextKeyDown}
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


            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Text Background</Label>
                    <Switch
                        checked={textStyle.hasBackground}
                        onCheckedChange={(checked) => handleStyleChange("hasBackground", checked)}
                    />
                </div>

                {textStyle.hasBackground && (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium">Background Color</Label>
                        </div>

                        <ColorPicker
                            value={textStyle.backgroundColor}
                            onChange={(color) => {
                                setBackgroundInputValue(color);
                                handleStyleChange("backgroundColor", color);
                            }}
                        />

                        <div className="flex gap-2 items-center">
                            <Select value={backgroundColorFormat} onValueChange={(value: "string" | "hex" | "rgb") => setBackgroundColorFormat(value)}>
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
                                value={backgroundInputValue}
                                onChange={handleBackgroundInputChange}
                                onBlur={handleBackgroundInputBlur}
                                onKeyDown={handleBackgroundKeyDown}
                                className="flex-1"
                            />
                        </div>

                        <div>
                            <Label>Background Opacity</Label>
                            <Slider
                                value={[textStyle.backgroundOpacity]}
                                onValueChange={([value]) => handleStyleChange("backgroundOpacity", value)}
                                min={0}
                                max={1}
                                step={0.01}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label>Background Radius</Label>
                            <Slider
                                value={[textStyle.backgroundRadius]}
                                onValueChange={([value]) => handleStyleChange("backgroundRadius", value)}
                                min={0}
                                max={50}
                                step={1}
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorControls;