import { forwardRef } from 'react';
import { TextControlsProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorControls from './ColorControls';
import BackgroundControls from './BackgroundControls';
import BorderControl from './BorderControl';
import FontControls from './FontControls';
import TextInput from './TextInput';

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
            className="p-4 rounded-lg border bg-gray-900"
            ref={ref}
            onBlur={handleControlFocusOut}
            tabIndex={-1}
        >
            <h3 className="text-lg font-semibold mb-4">Text Controls</h3>
            <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="font">Font</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <div className="space-y-4">
                        <TextInput
                            textContent={textContent}
                            setTextContent={setTextContent}
                            makeCaps={makeCaps}
                            changeTextAlign={changeTextAlign}
                            changeTextStyle={changeTextStyle}
                            textStyle={textStyle}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="color">
                    <div className="space-y-4">
                        <ColorControls
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                        <BackgroundControls
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="font">
                    <div className="space-y-4">
                        <FontControls
                            textContent={textContent}
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                        <BorderControl
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;