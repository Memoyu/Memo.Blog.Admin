import React, { FC, useState, useRef } from 'react';
import { Image } from '@douyinfe/semi-ui';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { qiniuTokenGet } from '@src/utils/request';
import { useOnMountUnsafe } from '@src/hooks/useOnMountUnsafe';
import {
    BeforeUploadObjectResult,
    BeforeUploadProps,
    FileItem,
    OnChangeProps,
} from '@douyinfe/semi-ui/lib/es/upload';
import { QiniuUploadModel } from '@src/common/model';

import './index.scss';

interface Iprops {
    limit?: number;
    path: string;
    files?: Array<FileItem>;
    onSuccess: (url: string) => void;
}

const Index: FC<Iprops> = ({ limit = 1, path, files, onSuccess }) => {
    // 获取七牛云上传token
    let getQiniuUploadToken = async (fileName: string) => {
        let fullPath = filePath + fileName;
        setFileName(fileName);
        setFileFullPath(fullPath);
        let res = await qiniuTokenGet(fullPath);
        if (!res.isSuccess || !res.data) {
            return;
        }
        // console.log('qiniu', res);
        return res.data;
    };

    let getFileName = (file: FileItem) => {
        let sourceName = file.name;
        let uid = file.uid;
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(sourceName);
        if (ext == null) return sourceName;
        return uid + '.' + ext[1];
    };

    const [filePath, setFilePath] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [fileFullPath, setFileFullPath] = useState<string>('');
    const [images, setImages] = useState<Array<FileItem>>([]);
    const qiniuTokenRef = useRef<string>('');
    const [host, setHost] = useState<string>('');

    useOnMountUnsafe(() => {
        setImages(files ?? []);
        setFilePath(path.replace(new RegExp('\\/+$', 'g'), '') + '/');
    });

    let handleBeforeUpload = async (upProps: BeforeUploadProps) => {
        let file = upProps.file;
        let result = {
            autoRemove: false,
            fileInstance: file.fileInstance,
            shouldUpload: true,
        } as BeforeUploadObjectResult;

        let tokenRes = await getQiniuUploadToken(getFileName(file));
        if (!tokenRes) return result;
        let token = tokenRes.token;
        qiniuTokenRef.current = token;
        setHost(tokenRes.host);

        if (!token || token.length <= 0) {
            result = {
                autoRemove: false,
                status: 'uploadFail',
                fileInstance: file.fileInstance,
                validateMessage: '无法上传附件',
                shouldUpload: false,
            };
        }
        // console.log('beforeUpload', result, upProps);
        return result;
    };

    let handleUploadSuccess = async (responseBody: object) => {
        // console.log('responseBody', responseBody);
        let res = { ...responseBody } as QiniuUploadModel;
        if (res.key.length > 0) onSuccess(host + res.key);
    };

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
            picHeight={120}
            picWidth={300}
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
            添加头图
        </Upload>
    );
};

export default Index;
