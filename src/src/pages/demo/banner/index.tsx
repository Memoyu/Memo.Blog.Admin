import { FC, useRef, useState } from 'react';
import { Upload } from '@douyinfe/semi-ui';

import './index.scss';
import {
    BeforeUploadObjectResult,
    BeforeUploadProps,
    FileItem,
} from '@douyinfe/semi-ui/lib/es/upload';
import { getFileExt } from '@src/utils/file';
import { uuid } from '@src/utils/uuid';
import { qiniuDemoTokenGet } from '@src/utils/request';
import { IconPlus } from '@douyinfe/semi-icons';

const Index: FC = () => {
    const [fileFullPath, setFileFullPath] = useState<string>('');
    const qiniuTokenRef = useRef<string>('');
    const [filePath, setFilePath] = useState<string>('');

    const [host, setHost] = useState<string>('');

    // 组装uuid文件名
    let getFileName = (file: FileItem) => {
        let uid = uuid();
        return uid + getFileExt(file.name);
    };

    // 获取七牛云上传token
    let getQiniuUploadToken = async (fileName: string) => {
        let fullPath = filePath + fileName;
        setFileFullPath(fullPath);
        let res = await qiniuDemoTokenGet(fullPath);
        console.log('qiniu', res);
        return res.data.data;
    };

    let handleBeforeUpload = async (upProps: BeforeUploadProps) => {
        let file = upProps.file;
        let result = {
            autoRemove: false,
            fileInstance: file.fileInstance,
            shouldUpload: true,
        } as BeforeUploadObjectResult;

        let tokenRes = await getQiniuUploadToken(getFileName(file));

        if (!tokenRes || tokenRes?.token?.length <= 0) {
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
        return result;
    };

    return (
        <div className="config-banner">
            <Upload
                listType="picture"
                name="file"
                data={() => {
                    return {
                        key: fileFullPath,
                        token: qiniuTokenRef.current,
                    };
                }}
                action="https://up-z2.qiniup.com/"
                beforeUpload={(upProps) => handleBeforeUpload(upProps)}
            >
                <IconPlus size="extra-large" style={{ margin: 4 }} />
            </Upload>
        </div>
    );
};

export default Index;
