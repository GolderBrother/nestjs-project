
import { InboxOutlined } from '@ant-design/icons';
import { Image, Upload, message, UploadProps } from 'antd';
import { useMemo } from 'react';


interface HeadPicUploadProps {
  value?: string;
  onChange?: (data: any) => void;
}

const { Dragger } = Upload;
const buildProps = (onChange: HeadPicUploadProps['onChange']) => {
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'http://localhost:3005/user/upload',
    onChange(info) {
      console.log('info', info);
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        onChange?.(info.file.response.data);
        message.success(`${info.file.name} 文件上传成功.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`);
      }
    },
  };
  return props;
}

export function HeadPicUpload({ value, onChange }: HeadPicUploadProps = {}) {
  const draggerProps = useMemo(() => buildProps(onChange), [onChange]);
  return (
    <>
      {value && <div style={{
        marginBottom: '10px'
      }}><Image src={'http://localhost:3005/' + value} alt="头像" width={100} height={100}/></div>}
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖动文件到此区域上传</p>
      </Dragger>
    </>
  );
}