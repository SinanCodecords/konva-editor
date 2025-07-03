import type Konva from 'konva';
import { TextElement } from '@/types';
import { useEditorStore } from '@/lib/store';

const DEFAULT_TEXT_STYLE = {
    fontSize: 30,
    fontFamily: 'Arial',
    fill: '#000000',
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
};

export const useTextEditor = () => {
    const {
        textElements,
        setTextElements,
        selectedElementId,
        setSelectedElementId,
        currentTextInput,
        setCurrentTextInput,
        previewTextElement,
        setPreviewTextElement,
    } = useEditorStore();

    const selectedTextElement = textElements.find((el) => el.id === selectedElementId) || null;

    const addTextElement = (text: string) => {
        if (text.trim()) {
            const newElement: TextElement = {
                id: `text-${Date.now()}-${Math.random()}`,
                text: text.trim(),
                x: 200,
                y: 200,
                ...DEFAULT_TEXT_STYLE,
                isSelected: false,
            };

            setTextElements((prev) => [...prev, newElement]);
            setSelectedElementId(newElement.id);
            setCurrentTextInput('');
            setPreviewTextElement(null);
        }
    };

    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        setTextElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
        );
    };

    const setTextContent = (text: string) => {
        setCurrentTextInput(text);

        if (selectedElementId) {
            updateTextElement(selectedElementId, { text });
        } else {
          if (text.trim()) {
              setPreviewTextElement({
                  id: 'preview',
                  text: text.trim(),
                  x: 200,
                  y: 200,
                  ...DEFAULT_TEXT_STYLE,
                isSelected: false,
            });
            } else {
                setPreviewTextElement(null);
            }
        }
    };

    const handleTextInputBlur = () => {
        if (currentTextInput.trim() && !selectedElementId) {
            addTextElement(currentTextInput);
        }
        setCurrentTextInput('');
        setSelectedElementId(null);
        setPreviewTextElement(null);
    };

    const handleStyleChange = (key: string, value: any) => {
        if (selectedElementId) {
            updateTextElement(selectedElementId, { [key]: value });
        }
    };

    const handleTextDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        updateTextElement(id, {
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleTextTransform = (id: string, node: Konva.Text) => {
        updateTextElement(id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
        });
    };

    const handleTextSelect = (id: string) => {
        setTextElements((prev) => prev.map((el) => ({ ...el, isSelected: false })));
        setSelectedElementId(id);
        updateTextElement(id, { isSelected: true });
        const element = textElements.find((el) => el.id === id);
        if (element) {
            setCurrentTextInput(element.text);
        }
    };

    const removeText = (id?: string) => {
        const targetId = id || selectedElementId;
        if (targetId) {
            setTextElements((prev) => prev.filter((el) => el.id !== targetId));
            if (selectedElementId === targetId) {
                setSelectedElementId(null);
                setCurrentTextInput('');
                setPreviewTextElement(null);
            }
        }
    };

    const makeCaps = () => {
        if (selectedElementId) {
            const element = textElements.find((el) => el.id === selectedElementId);
            if (element) {
                const uppercaseText = element.text.toUpperCase();
                updateTextElement(selectedElementId, { text: uppercaseText });
                setCurrentTextInput(uppercaseText);
            }
        }
    };

    const deselectAll = () => {
        setTextElements((prev) => prev.map((el) => ({ ...el, isSelected: false })));
        setSelectedElementId(null);
        setPreviewTextElement(null);
        setCurrentTextInput('');
    };

    const getCurrentTextStyle = () => {
        if (selectedTextElement) {
            return {
                fontSize: selectedTextElement.fontSize,
                fontFamily: selectedTextElement.fontFamily,
                fill: selectedTextElement.fill,
            };
        }
        return {
            fontSize: DEFAULT_TEXT_STYLE.fontSize,
            fontFamily: DEFAULT_TEXT_STYLE.fontFamily,
            fill: DEFAULT_TEXT_STYLE.fill,
        };
    };

    return {
        textElements,
        selectedElementId,
        selectedTextElement,
        previewTextElement,
        currentTextInput,
        setTextContent,
        addTextElement,
        updateTextElement,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
        deselectAll,
        getCurrentTextStyle,
        handleTextInputBlur,
    };
};