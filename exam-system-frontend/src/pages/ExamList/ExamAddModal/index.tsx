import useForm from "antd/es/form/hooks/useForm";
import { ExamAdd } from "../../../api/types";
import { Modal, Input, Form, message } from "antd";
import { examAdd as examAddApi } from "../../../api";

export interface ExamAddModalProps {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handleClose: Function;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export function ExamAddModal(props: ExamAddModalProps) {
  const [form] = useForm<ExamAdd>();

  const handleOk = async () => {
    // 调用新建试卷接口
    await form.validateFields();
    const values = form.getFieldsValue();
    try {
      const res = await examAddApi(values);

      if (res.status === 201 || res.status === 200) {
        message.success("创建成功");
        form.resetFields();
        props.handleClose();
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || "系统繁忙，请稍后再试");
    }
  };
  return (
    <Modal
      title="新增试卷"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
      okText={"创建"}
      cancelText={"取消"}
    >
      <Form form={form} colon={false} {...layout}>
        <Form.Item
          label="试卷名"
          name="name"
          rules={[{ required: true, message: "请输入试卷名!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
