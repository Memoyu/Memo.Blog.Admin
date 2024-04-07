import { FC, useState } from 'react';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { MdEditor } from 'md-editor-rt';

import 'md-editor-rt/lib/style.css';
import './index.scss';

interface Iprops {
    height?: number;
    content?: string;
    onChange?: (content: string) => void;
}

const Index: FC<Iprops> = ({ height = 500, content, onChange }) => {
    const toolbars: Array<any> = [
        'bold',
        'underline',
        'italic',
        '-',
        'strikeThrough',
        'sub',
        'sup',
        'quote',
        'unorderedList',
        'orderedList',
        'task',
        '-',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        'mermaid',
        'katex',
        '-',
        'revoke',
        'next',
        'save',
        '=',
        'pageFullscreen',
        'fullscreen',
        'preview',
        'htmlPreview',
        'catalog',
    ];

    const [mdContent, setMdContent] = useState<string>('');

    useOnMountUnsafe(() => {
        setMdContent(content ?? '');
    });

    return (
        <div className="blog-md-editor">
            <MdEditor
                style={{ height: height }}
                modelValue={mdContent}
                toolbars={toolbars}
                onChange={(c) => onChange && onChange(c)}
            />
        </div>
    );
};

export default Index;
