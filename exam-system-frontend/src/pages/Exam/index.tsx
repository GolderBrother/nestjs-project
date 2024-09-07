import { Button, Checkbox, Input, message, Radio } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { examFind } from "../../api";
import { Question } from "../Edit/type";

export function Exam() {

    const { id } = useParams();
    const [componentJson, setComponentJson] = useState<Array<Question>>([])
    async function getExamDetail() {
        if (!id) {
            return;
        }
        try {
            const res = await examFind(+id);
            if (res.status === 201 || res.status === 200) {
                try {
                    setComponentJson(JSON.parse(res.data.content))
                } catch (e) { }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }

    useEffect(() => {
        getExamDetail();
    }, []);
    const renderComponents = (arr: Array<Question>) => {
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
            return <div className="component-item" key={item.id}>
                <p className="question">{item.question}</p>
                <div className="options">
                    {formComponent}
                </div>
            </div>
        });
    }
    return <div className="exam-container">
        Exam: {id}
        {renderComponents(componentJson)}
        <Button type="primary" className="btn">提交</Button>
    </div>
}

