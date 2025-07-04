import { forwardRef } from 'react';
import { TextControlsProps } from "@/types";
import FontControls from './FontControls';
import ColorControls from './ColorControls';

const ControlPanel = forwardRef<HTMLDivElement, TextControlsProps>(({
    textContent,
    setTextContent,
    handleControlFocusOut,
    textStyle,
    handleStyleChange,
    makeCaps,
    changeTextStyle,
    changeTextAlign
}, ref) => {
    return (
        <div className="p-4 rounded-lg border bg-gray-800" ref={ref} onBlur={handleControlFocusOut}>
            <h3 className="text-lg font-semibold mb-4">Text Controls</h3>
            <div className="space-y-4">
                <FontControls
                    textContent={textContent}
                    setTextContent={setTextContent}
                    textStyle={textStyle}
                    handleStyleChange={handleStyleChange}
                    makeCaps={makeCaps}
                    changeTextStyle={changeTextStyle}
                    changeTextAlign={changeTextAlign}
                />
                <ColorControls
                    textContent={textContent}
                    textStyle={textStyle}
                    handleStyleChange={handleStyleChange}
                />
            </div>
        </div>
    );
});

export default ControlPanel;