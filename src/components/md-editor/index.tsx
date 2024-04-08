import { FC, useState, useEffect } from 'react';
import { MdEditor } from 'md-editor-rt';

import { uuid } from '@src/utils/uuid';
import { getFileExt } from '@src/utils/file';

import { QiniuUploadRequest } from '@src/common/model';

import { qiniuUpload } from '@src/utils/request';

import 'md-editor-rt/lib/style.css';
import './index.scss';

interface Iprops {
    imgPath: string;
    height?: number;
    content?: string;
    onChange?: (content: string) => void;
}

const Index: FC<Iprops> = ({ imgPath, height = 500, content, onChange }) => {
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
    const [imagePath, setIamgePath] = useState<string>('');

    useEffect(() => {
        setMdContent(content ?? '');
        setIamgePath(imgPath.replace(new RegExp('\\/+$', 'g'), '') + '/');
    }, [content]);

    // 触发上传图片
    let handleUploadImg = async (files: Array<File>, callBack: (urls: any[]) => void) => {
        if (files.length <= 0) return;

        // 上传图片文件
        const res = await Promise.all(
            files.map((file) => {
                let fileExt = getFileExt(file.name);
                if (fileExt) {
                    let req: QiniuUploadRequest = { file, key: imagePath + uuid() + fileExt };
                    return qiniuUpload(req);
                }
            })
        );

        // 回调填入编辑框
        callBack(
            res.map((upRes) => {
                if (upRes) {
                    return {
                        url: upRes.url,
                        alt: upRes.file.name,
                    };
                }
            })
        );
    };

    return (
        <div className="blog-md-editor">
            <MdEditor
                style={{ height: height }}
                modelValue={mdContent}
                toolbars={toolbars}
                onChange={(c) => {
                    setMdContent(c);
                    onChange && onChange(c);
                }}
                onUploadImg={(files, callback) => handleUploadImg(files, callback)}
            />
        </div>
    );
};

export default Index;
