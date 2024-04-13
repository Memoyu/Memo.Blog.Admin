import { FC, useEffect, useState, useRef } from 'react';
import { Image, Toast } from '@douyinfe/semi-ui';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { qiniuTokenGet } from '@src/utils/request';
import {
    BeforeUploadObjectResult,
    BeforeUploadProps,
    FileItem,
    OnChangeProps,
} from '@douyinfe/semi-ui/lib/es/upload';
import { QiniuUploadModel } from '@src/common/model';

import './index.scss';
import { getFileExt } from '@src/utils/file';

interface Iprops {
    width?: number;
    height?: number;
    limit?: number;
    path: string;
    url?: string;
    title?: string;
    onSuccess: (url: string) => void;
}

// 上传单个图片组件
const Index: FC<Iprops> = ({
    width = 120,
    height = 300,
    limit = 1,
    path,
    url,
    title = '',
    onSuccess,
}) => {
    const [filePath, setFilePath] = useState<string>('');
    const [fileFullPath, setFileFullPath] = useState<string>('');
    const [images, setImages] = useState<Array<FileItem>>([]);
    const qiniuTokenRef = useRef<string>('');
    const [host, setHost] = useState<string>('');

    // 获取七牛云上传token
    let getQiniuUploadToken = async (fileName: string) => {
        let fullPath = filePath + fileName;
        setFileFullPath(fullPath);
        let res = await qiniuTokenGet(fullPath);
        if (!res.isSuccess || !res.data) {
            Toast.error(res.message);
            return undefined;
        }
        // console.log('qiniu', res);
        return res.data;
    };

    // 组装uuid文件名
    let getFileName = (file: FileItem) => {
        let uid = file.uid;
        return uid + getFileExt(file.name);
    };

    useEffect(() => {
        if (url && url?.length > 0) setImages([{ url: url } as FileItem]);
        setFilePath(path.replace(new RegExp('\\/+$', 'g'), '') + '/');
    }, [url]);

    // 上传图片前触发
    let handleBeforeUpload = async (upProps: BeforeUploadProps) => {
        let file = upProps.file;
        let result = {
            autoRemove: false,
            fileInstance: file.fileInstance,
            shouldUpload: true,
        } as BeforeUploadObjectResult;

        let tokenRes = await getQiniuUploadToken(getFileName(file));

        if (!tokenRes || tokenRes?.token?.length <= 0) {
            // console.log('uploadFail');
            result = {
                autoRemove: false,
                status: 'uploadFail',
                fileInstance: file.fileInstance,
                validateMessage: '无法上传附件',
                shouldUpload: false,
            };
        } else {
            let token = tokenRes.token;
            qiniuTokenRef.current = token;
            setHost(tokenRes.host);
        }

        // console.log('beforeUpload', result, upProps);
        return result;
    };

    // 上传图片成功后触发
    let handleUploadSuccess = async (responseBody: object) => {
        // console.log('responseBody', responseBody);
        let res = { ...responseBody } as QiniuUploadModel;
        if (res.key.length > 0) onSuccess(host + res.key);
    };

    // 图片变更触发
    const handleUploadChange = (ocProps: OnChangeProps) => {
        // console.log('change', ocProps);
        let newFileList = [...ocProps.fileList];
        setImages(newFileList);
    };

    return (
        <Upload
            className="blog-upload-image"
            style={{ margin: '0px 5px' }}
            defaultFileList={images}
            fileList={images}
            picHeight={width}
            picWidth={height}
            accept="image/*"
            listType="picture"
            name="file"
            limit={limit}
            data={() => {
                return {
                    key: fileFullPath,
                    token: qiniuTokenRef.current,
                };
            }}
            action="https://up-z2.qiniup.com"
            renderThumbnail={(file) => <Image src={file.url} />}
            beforeUpload={(upProps) => handleBeforeUpload(upProps)}
            onSuccess={(responseBody) => handleUploadSuccess(responseBody)}
            onChange={(ocProps) => handleUploadChange(ocProps)}
        >
            <IconPlus size="extra-large" style={{ margin: 4 }} />
            {title}
        </Upload>
    );
};

export default Index;
