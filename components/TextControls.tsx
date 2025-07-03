import { TextControlsProps } from "@/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

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

const TextControls = ({
    textContent,
    setTextContent,
    handleControlFocusOut,
    textStyle,
    handleStyleChange,
    makeCaps,
    changeTextStyle,
    changeTextAlign
}: TextControlsProps) => {
    const isAllCaps = textContent === textContent.toUpperCase() && textContent.length > 0;

    return (
        <div className="p-4 rounded-lg border bg-gray-800" onBlur={handleControlFocusOut}>
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
                            placeholder="Type to add text..."
                            className="mt-1"
                        />
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

                <div className="flex gap-2">
                    <Button
                        onClick={makeCaps}
                        variant={isAllCaps ? "default" : "ghost"}
                        className={`capitalize`}
                    >
                        T
                    </Button>
                    <Button
                        onClick={() => changeTextStyle("bold")}
                        variant={textStyle.fontStyle === "bold" ? "default" : "ghost"}
                        className={`font-extrabold`}
                    >
                        B
                    </Button>
                    <Button
                        onClick={() => changeTextStyle("italic")}
                        variant={textStyle.fontStyle === "italic" ? "default" : "ghost"}
                        className={`italic`}
                    >
                        I
                    </Button>
                    <span className="border border-white" />
                    <Button
                        onClick={() => changeTextAlign("left")}
                        variant={textContent && textStyle.align === "left" ? "default" : "ghost"}
                    >
                        <AlignLeftIcon />
                    </Button>
                    <Button
                        onClick={() => changeTextAlign("center")}
                        variant={textContent && textStyle.align === "center" ? "default" : "ghost"}
                    >
                        <AlignCenterIcon />
                    </Button>
                    <Button
                        onClick={() => changeTextAlign("right")}
                        variant={textContent && textStyle.align === "right" ? "default" : "ghost"}
                    >
                        <AlignRightIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TextControls;