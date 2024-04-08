import { FC, useState } from 'react';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import { MdEditor } from 'md-editor-rt';

import 'md-editor-rt/lib/style.css';
import './index.scss';
import { qiniuUpload } from '@src/utils/request';
import { QiniuUploadRequest } from '@src/common/model';

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

    let handleUploadImg = async (files: Array<File>, callBack: (urls: string[]) => void) => {
        if (files.length <= 0) return;
        let file = files[0];
        let req: QiniuUploadRequest = { file, key: 'articles/' + file.name };
        let url = await qiniuUpload(req);
        if (url.length > 0) {
            callBack([url]);
        }
    };

    return (
        <div className="blog-md-editor">
            <MdEditor
                style={{ height: height }}
                modelValue={mdContent}
                toolbars={toolbars}
                onChange={(c) => onChange && onChange(c)}
                onUploadImg={(files, callback) => handleUploadImg(files, callback)}
            />
        </div>
    );
};

export default Index;
