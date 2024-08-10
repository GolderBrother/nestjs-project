import { InboxOutlined } from "@ant-design/icons";
import { message } from "antd";
import Dragger, { DraggerProps } from "antd/es/upload/Dragger";
import axios from "axios";
import { presignedUrl } from "../../api";

interface HeadPicUploadProps {
    value?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onChange?: Function
}

// eslint-disable-next-line @typescript-eslint/ban-types
let onChange: Function;

const props: DraggerProps = {
    name: 'file',
    // action: 'http://localhost:3005/xxxx',
    action: async (file) => {
        const res = await presignedUrl(file.name);
        return res.data;
    },
    async customRequest(options) {
        const { onSuccess, file, action } = options;
    
        const res = await axios.put(action, file);
    
        onSuccess!(res.data);
    },
    
    onChange(info) {
        const { status, name } = info.file;
        if (status === 'done') {
            onChange('http://localhost:9000/chat-room/' + name);
            message.success(`${name} 文件上传成功`);
        } else if (status === 'error') {
            message.error(`${name} 文件上传失败`);
        }
    }
};

const dragger = <Dragger {...props}>
    <p className="ant-upload-drag-icon">
        <InboxOutlined />
    </p>
    <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
</Dragger>

export function HeadPicUpload(props: HeadPicUploadProps) {

    onChange = props.onChange!

    return props?.value ? <div>
        <img src={props.value} alt="头像" width="100" height="100"/>
        {dragger}
    </div>: <div>
        {dragger}
    </div>
}
