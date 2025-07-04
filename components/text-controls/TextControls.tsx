import { forwardRef } from 'react';
import { TextControlsProps } from "@/types";
import FontControls from './FontControls';
import ColorControls from './ColorControls';
import BackgroundControls from './BackgroundControls';
import BorderControl from './BorderControl';

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
        <div
            className="p-4 rounded-lg border bg-gray-900 "
            ref={ref}
            onBlur={handleControlFocusOut}
            tabIndex={-1}
        >
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
                    textStyle={textStyle}
                    handleStyleChange={handleStyleChange}
                />
                <BackgroundControls
                    textStyle={textStyle}
                    handleStyleChange={handleStyleChange}
                />
                <BorderControl
                    textStyle={textStyle}
                    handleStyleChange={handleStyleChange}
                />
            </div>
        </div>
    );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;