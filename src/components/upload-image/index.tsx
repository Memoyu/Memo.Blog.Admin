import React, { FC, useState } from 'react';
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

interface Iprops {
    limit?: number;
    path: string;
    files?: Array<FileItem>;
}

const Index: FC<Iprops> = ({ limit = 1, path, files }) => {
    // 获取七牛云上传token
    let getQiniuUploadToken = async () => {
        let res = await qiniuTokenGet('articles/test.png');
        if (!res.isSuccess || !res.data) {
            return;
        }
        // console.log('qiniu', res);
        setQiniuToken(res.data.token);
    };

    const [images, setImages] = useState<Array<FileItem>>([]);
    const [qiniuToken, setQiniuToken] = useState<string>('');

    useOnMountUnsafe(() => {
        setImages(files ?? []);
        console.log('images', files, images);
        getQiniuUploadToken();
    });

    let handleBeforeUpload = (upProps: BeforeUploadProps) => {
        let result = {
            autoRemove: false,
            fileInstance: upProps.file.fileInstance,
            shouldUpload: true,
        } as BeforeUploadObjectResult;

        if (qiniuToken.length <= 0) {
            result = {
                autoRemove: false,
                status: 'uploadFail',
                fileInstance: upProps.file.fileInstance,
                validateMessage: '无法上传附件',
                shouldUpload: false,
            };
        }
        console.log('result', result, upProps.fileList);
        return result;
    };

    const handleUploadChange = (ocProps: OnChangeProps) => {
        console.log('onChange');
        console.log(ocProps.fileList);
        console.log(ocProps.currentFile);
        let newFileList = [...ocProps.fileList]; // spread to get new array
        setImages(newFileList);
    };

    return (
        <Upload
            defaultFileList={images}
            fileList={images}
            picHeight={110}
            picWidth={300}
            accept="image/*"
            listType="picture"
            name="file"
            limit={limit}
            data={{
                key: path,
                token: qiniuToken,
            }}
            action="https://up-z2.qiniup.com"
            renderThumbnail={(file) => <Image src={file.url} />}
            onRemove={(file, files) => {
                files = [];
            }}
            beforeUpload={(upProps) => handleBeforeUpload(upProps)}
            onChange={(ocProps) => handleUploadChange(ocProps)}
        >
            <IconPlus size="extra-large" style={{ margin: 4 }} />
        </Upload>
    );
};

export default Index;
