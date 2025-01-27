import { FC, useEffect, useState, useRef } from 'react';
import { Image, Avatar, Toast, Typography } from '@douyinfe/semi-ui';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus, IconCamera } from '@douyinfe/semi-icons';
import { getFileExt } from '@src/utils/file';
import { uuid } from '@src/utils/uuid';
import { qiniuTokenGet } from '@src/utils/request';

import {
    BeforeUploadObjectResult,
    BeforeUploadProps,
    FileItem,
    OnChangeProps,
} from '@douyinfe/semi-ui/lib/es/upload';
import { QiniuUploadModel } from '@src/common/model';

import './index.scss';

const { Text } = Typography;

interface Iprops {
    width?: number | string;
    height?: number | string;
    path: string;
    url?: string;
    title?: string;
    type?: 'avatar' | 'banner' | 'image';
    onSuccess: (url: string) => void;
    onRemove?: () => void;
}

// 上传单个图片组件
const Index: FC<Iprops> = ({
    width,
    height,
    path,
    url,
    title = '',
    type = 'image',
    onSuccess,
    onRemove,
}) => {
    const [filePath, setFilePath] = useState<string>('');
    const [fileFullPath, setFileFullPath] = useState<string>('');
    const [images, setImages] = useState<Array<FileItem>>();
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
        let uid = uuid();
        return uid + getFileExt(file.name);
    };

    // 获取上传组件宽高
    let getSize = () => {
        let h = height ? height : type == 'avatar' ? 55 : type == 'banner' ? 120 : 88;
        let w = width ? width : type == 'avatar' ? 55 : type == 'banner' ? 300 : 88;
        return [h, w];
    };

    // 是否展示上传集合
    let getShowUploadList = () => {
        return type == 'avatar' ? false : true;
    };

    // 获取上传占位元素
    let getChildren = () => {
        if (type != 'avatar') {
            return (
                <>
                    <IconPlus size="large" style={{ margin: 4 }} />
                    <Text> {title}</Text>
                </>
            );
        } else {
            return (
                <Avatar
                    src={url}
                    hoverMask={
                        <div
                            style={{
                                backgroundColor: 'var(--semi-color-overlay-bg)',
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--semi-color-white)',
                            }}
                        >
                            <IconCamera />
                        </div>
                    }
                />
            );
        }
    };

    useEffect(() => {
        if (type != 'avatar' && url && url?.length > 0) setImages([{ url: url } as FileItem]);
        else setImages([]);
        setFilePath(path.replace(new RegExp('\\/+$', 'g'), '') + '/');
    }, [url]);

    // 上传图片前触发
    let handleBeforeUpload = (upProps: BeforeUploadProps) => {
        return new Promise<BeforeUploadObjectResult>((resolve, reject) => {
            let file = upProps.file;
            let result = {
                autoRemove: false,
                fileInstance: file.fileInstance,
                shouldUpload: false,
            } as BeforeUploadObjectResult;

            let failResult = {
                autoRemove: true,
                status: 'uploadFail',
                fileInstance: file.fileInstance,
                validateMessage: '无法上传附件',
                shouldUpload: false,
            };

            getQiniuUploadToken(getFileName(file))
                .then((res) => {
                    if (!res || res?.token?.length <= 0) {
                        // console.log('uploadFail');
                        reject(failResult);
                    } else {
                        let token = res.token;
                        qiniuTokenRef.current = token;
                        result.shouldUpload = true;
                        setHost(res.host);
                        // console.log('beforeUpload', result, upProps);
                        resolve(result);
                    }
                })
                .catch((err) => {
                    reject(failResult);
                    console.log(err);
                });
        });
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
    const handleUploadRemove = (
        _currentFile: File,
        _fileList: Array<FileItem>,
        _currentFileItem: FileItem
    ) => {
        onRemove && onRemove();
    };

    return (
        <div className={type == 'avatar' ? 'blog-avatar-upload' : 'blog-image-upload'}>
            <Upload
                style={{ margin: '0px 5px' }} // 解决报错时，红色边框被遮住问题
                // defaultFileList={images}
                fileList={images}
                showUploadList={getShowUploadList()}
                picHeight={getSize()[0]}
                picWidth={getSize()[1]}
                accept="image/*"
                listType="picture"
                name="file"
                limit={1}
                data={() => {
                    return {
                        key: fileFullPath,
                        token: qiniuTokenRef.current,
                    };
                }}
                // headers={{ Accept: 'application/json' }}
                action="https://up-z2.qiniup.com/"
                renderThumbnail={(file) =>
                    type != 'avatar' ? <Image src={file.url} /> : undefined
                }
                beforeUpload={(upProps) => handleBeforeUpload(upProps)}
                onSuccess={(responseBody) => handleUploadSuccess(responseBody)}
                onChange={(ocProps) => handleUploadChange(ocProps)}
                onRemove={handleUploadRemove}
            >
                {getChildren()}
            </Upload>
        </div>
    );
};

export default Index;
