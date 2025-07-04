import { ColorControlsProps } from "@/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";


const ColorControls = ({
    textContent,
    textStyle,
    handleStyleChange
}: ColorControlsProps) => {
    return (
        <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                    <Input
                        type="color"
                        disabled={!!textContent === false}
                        value={textStyle.fill}
                        onChange={(e) => handleStyleChange("fill", e.target.value)}
                        className="w-16 h-8 p-0 border-0"
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorControls;