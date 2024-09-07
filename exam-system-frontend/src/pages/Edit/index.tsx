import { Link, useParams } from "react-router-dom";
import "./index.scss";
import {
    Button,
    Checkbox,
    Input,
    Form,
    Radio,
    InputNumber,
    Segmented,
    message,
    Space,
} from "antd";
import { Question } from "./type";
import { MaterialItem } from "./Material";
import { useDrop } from "react-dnd";
import { useEffect, useMemo, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useForm } from "antd/es/form/Form";
import { examFind, examSave } from "../../api";
import { PreviewModal } from "./PreviewModal/index";

export function Edit() {
    const { id } = useParams();
    const [componentJson, setComponentJson] = useState<Array<Question>>([]);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ["单选题", "多选题", "填空题"],
        drop: (item: { type: string }) => {
            const type = {
                单选题: "radio",
                多选题: "checkbox",
                填空题: "input",
            }[item.type] as Question["type"];
            setComponentJson((state) => [
                ...state,
                {
                    id: new Date().getTime(),
                    type,
                    question: "最高的山？",
                    options: ["选项1", "选项2"],
                    score: 5,
                    answer: "选项1",
                    answerAnalyse: "答案解析",
                },
            ]);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));
    const [curQuestionId, setCurQuestionId] = useState<number>();

    const getExamDetail = async () => {
        if (!id) {
            return;
        }
        try {
            const res = await examFind(+id);
            if (res.status === 201 || res.status === 200) {
                try {
                    setComponentJson(JSON.parse(res.data.content));
                } catch (e) {
                    console.error("e");
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            message.error(e.response?.data?.message || "系统繁忙，请稍后再试");
        }
    };
    useEffect(() => {
        getExamDetail();
    }, []);

    function renderComponents(arr: Array<Question>) {
        return arr.map((item) => {
            let formComponent;
            if (item.type === "radio") {
                formComponent = (
                    <Radio.Group>
                        {item.options?.map((option) => (
                            <Radio value={option}>{option}</Radio>
                        ))}
                    </Radio.Group>
                );
            } else if (item.type === "checkbox") {
                formComponent = <Checkbox.Group options={item.options} />;
            } else if (item.type === "input") {
                formComponent = <Input />;
            }
            return (
                <div
                    className="component-item"
                    key={item.id}
                    onClick={() => {
                        setCurQuestionId(item.id);
                    }}
                    style={item.id === curQuestionId ? { border: "2px solid blue" } : {}}
                >
                    <p className="question">{item.question}</p>
                    <div className="options">{formComponent}</div>
                    <p className="score">分值：{item.score}</p>
                    <p className="answer">答案：{item.answer}</p>
                    <p className="answerAnalyse">答案解析：{item.answerAnalyse}</p>
                </div>
            );
        });
    }

    const [form] = useForm();
    const currentJson = useMemo(() => componentJson.find((item) => item.id === curQuestionId), [componentJson, curQuestionId]);
    useEffect(() => {
        const currentJson = componentJson.find((item) => item.id === curQuestionId);
        if (currentJson) {
            form.setFieldsValue(currentJson);
        }
    }, [componentJson, curQuestionId, form]);

    const [key, setKey] = useState<string>("json");

    async function saveExam() {
        if (!id) {
            return;
        }
        try {
            const content = JSON.stringify(componentJson);
            const res = await examSave({
                id: +id,
                content,
            });
            if (res.status === 201 || res.status === 200) {
                message.success("保存成功");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            message.error(e.response?.data?.message || "系统繁忙，请稍后再试");
        }
    }

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
    const openPreviewModal = () => {
        setIsPreviewModalOpen(true);
    };
    const closePreviewModal = () => {
        setIsPreviewModalOpen(false);
    };
    const previewExam = () => {
        openPreviewModal();
    };

    return (
        <div id="edit-container">
            <div className="header">
                <div>试卷编辑器</div>
                <div>
                    <Space>
                        <Button type="default" onClick={previewExam}>
                            预览
                        </Button>
                        <Button type="primary" onClick={saveExam}>
                            保存
                        </Button>
                        <Button type="default">
                            <Link to="/">返回</Link>
                        </Button>
                    </Space>
                </div>
            </div>
            <div className="body">
                <div className="materials">
                    <MaterialItem name="单选题" type="单选题" />
                    <MaterialItem name="多选题" type="多选题" />
                    <MaterialItem name="填空题" type="填空题" />
                </div>
                <div
                    className="edit-area"
                    ref={drop}
                    style={
                        isOver
                            ? {
                                border: "2px solid #1890ff",
                            }
                            : {}
                    }
                >
                    {renderComponents(componentJson)}
                </div>
                <div className="setting">
                    <Segmented
                        value={key}
                        onChange={setKey}
                        block
                        options={["json", "属性"]}
                    />
                    {key === "json" ? (
                        <pre>{JSON.stringify(componentJson, null, 4)}</pre>
                    ) : (
                        // 根据 curQuestionId 从 json 中找到对应的数据，用 Form 来回显s
                        curQuestionId &&
                            currentJson
                            ? <div key={curQuestionId}>
                                <Form
                                    style={{ padding: "20px" }}
                                    initialValues={currentJson}
                                    onValuesChange={(changed, values) => {
                                        setComponentJson((json) => {
                                            return json.map((cur) => {
                                                return cur.id === currentJson.id
                                                    ? {
                                                        id: currentJson.id,
                                                        ...values,
                                                        options:
                                                            typeof values.options === "string"
                                                                ? values.options?.split(",")
                                                                : values.options,
                                                    }
                                                    : cur;
                                            });
                                        });
                                    }}
                                >
                                    <Form.Item
                                        label="问题"
                                        name="question"
                                        rules={[{ required: true, message: "请输入问题!" }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="类型"
                                        name="type"
                                        rules={[{ required: true, message: "请选择类型!" }]}
                                    >
                                        <Radio.Group>
                                            <Radio value="radio">单选题</Radio>
                                            <Radio value="checkbox">多选题</Radio>
                                            <Radio value="input">填空题</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {currentJson.type !== "input" && (
                                        <Form.Item
                                            label="选项（逗号分割）"
                                            name="options"
                                            rules={[{ required: true, message: "请输入选项!" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    )}
                                    <Form.Item
                                        label="分数"
                                        name="score"
                                        rules={[{ required: true, message: "请输入分数!" }]}
                                    >
                                        <InputNumber />
                                    </Form.Item>
                                    <Form.Item
                                        label="答案"
                                        name="answer"
                                        rules={[{ required: true, message: "请输入答案!" }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="答案分析"
                                        name="answerAnalyse"
                                        rules={[{ required: true, message: "请输入答案分析!" }]}
                                    >
                                        <TextArea />
                                    </Form.Item>
                                </Form>
                            </div> : null
                    )}
                </div>
            </div>
            <PreviewModal
                isOpen={isPreviewModalOpen}
                json={componentJson}
                handleClose={closePreviewModal}
            />
        </div>
    );
}
