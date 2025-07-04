import { Input } from "@/components/ui/input";

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    colors?: string[];
}

const ColorPicker = ({ value, onChange, colors = [
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
] }: ColorPickerProps) => {
    return (
        <div className="flex gap-2 items-center flex-wrap">
            <Input
                type="color"
                value={value.startsWith('#') ? value : '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-8 p-0 border-2 rounded-lg cursor-pointer"
            />
            {colors.map((color, index) => (
                <div
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${value === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                        }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(color)}
                    title={color}
                />
            ))}
        </div>
    );
};

export default ColorPicker;