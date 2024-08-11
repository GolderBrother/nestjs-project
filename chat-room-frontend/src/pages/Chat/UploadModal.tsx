import { Modal } from "antd";
import { FileUpload } from "./FileUpload";
import { useMemo, useState } from "react";

interface UploadModalProps {
    isOpen: boolean;
    type: 'image' | 'file'
    handleClose: (imageSrc?: string) => void
}

export function UploadModal(props: UploadModalProps) {
    const [imgSrc, setImgSrc] = useState<string>('');
    const title = useMemo(() => `上传${props.type === 'image' ? '图片' : '文件'}`, [props.type])
    return <Modal 
        title={title}
        open={props.isOpen}
        onOk={() => {
            props.handleClose(imgSrc)
            setImgSrc('')
        }}
        onCancel={() => props.handleClose()}
        okText={'确认'}
        cancelText={'取消'}    
    >
        <FileUpload value={imgSrc} type={props.type} onChange={(value: string) => {
            setImgSrc(value)
        }}/>
    </Modal>
}
