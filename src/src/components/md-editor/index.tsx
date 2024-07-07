import { FC, useState, useEffect } from 'react';
import { MdEditor, config } from 'md-editor-rt';

import { shallow } from 'zustand/shallow';
import useTheme from '@src/stores/useTheme';

import { uuid } from '@src/utils/uuid';
import { getFileExt } from '@src/utils/file';
import { qiniuUpload } from '@src/utils/request';

import { QiniuUploadRequest } from '@src/common/model';

import 'md-editor-rt/lib/style.css';
import './index.scss';
import { debounce } from '@src/utils/md';

interface Iprops {
    imgPath: string;
    height?: number;
    content?: string;
    onChange?: (content: string) => void;
    onSave?: () => void;
}

config({
    editorExtensions: {
        highlight: {
            css: {
                vs: {
                    light: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs.min.css',
                    dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css',
                },
            },
        },
    },
});

const onHtmlChanged = debounce(() => {
    const { hash } = location;

    if (/^#/.test(hash)) {
        const headingId = decodeURIComponent(hash.replace('#', ''));

        if (headingId) {
            const targetHeadDom = document.getElementById(headingId);

            if (targetHeadDom) {
                const scrollLength = (targetHeadDom as HTMLHeadElement).offsetTop + 414;

                window.scrollTo({
                    top: scrollLength,
                    behavior: 'smooth',
                });
            }
        }
    }
});

const Index: FC<Iprops> = ({ imgPath, height = 500, content, onChange, onSave }) => {
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
    const theme = useTheme((state) => state.theme, shallow);

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
                theme={theme}
                previewTheme="github"
                codeTheme="vs"
                modelValue={mdContent}
                toolbars={toolbars}
                onChange={(c) => {
                    setMdContent(c);
                    onChange && onChange(c);
                }}
                onUploadImg={(files, callback) => handleUploadImg(files, callback)}
                onHtmlChanged={onHtmlChanged}
                onSave={() => onSave && onSave()}
            />
        </div>
    );
};

export default Index;
