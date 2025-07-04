import { FontControlsProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

const FONT_FAMILIES = [
    "Arial",
    "Helvetica",
    "Garamond",
    "Comic Sans MS",
    "Arial Black",
    "Impact",
];

const FontControls = ({
    textContent,
    setTextContent,
    textStyle,
    handleStyleChange,
    makeCaps,
    changeTextStyle,
    changeTextAlign
}: FontControlsProps) => {
    const isAllCaps = textContent === textContent.toUpperCase() && textContent.length > 0;

    return (
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
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {FONT_FAMILIES.map((font) => (
                        <Button
                            key={font}
                            onClick={() => handleStyleChange("fontFamily", font)}
                            variant={textContent && textStyle.fontFamily === font ? "outline" : "ghost"}
                            className="justify-start border"
                            style={{ fontFamily: font }}
                        >
                            {font}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <Label>Font Size: {Math.round(textStyle.fontSize)}px</Label>
                <Slider
                    value={[textStyle.fontSize]}
                    onValueChange={([value]) => handleStyleChange("fontSize", value)}
                    min={12}
                    disabled={!!textContent === false}
                    max={100}
                    step={1}
                    className="mt-2"
                />
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={makeCaps}
                    variant={isAllCaps ? "default" : "ghost"}
                    className="capitalize"
                >
                    T
                </Button>
                <Button
                    onClick={() => changeTextStyle("bold")}
                    variant={textStyle.fontStyle === "bold" ? "default" : "ghost"}
                    className="font-extrabold"
                >
                    B
                </Button>
                <Button
                    onClick={() => changeTextStyle("italic")}
                    variant={textStyle.fontStyle === "italic" ? "default" : "ghost"}
                    className="italic"
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
    );
};

export default FontControls;