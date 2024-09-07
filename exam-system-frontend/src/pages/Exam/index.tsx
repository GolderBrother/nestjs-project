import { Button, Checkbox, Input, message, Radio } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerAdd, examFind } from "../../api";
import { Question } from "../Edit/type";
import './index.scss'
export interface AnswerItem {
    id: number; answer: string
}
export function Exam() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState<Array<AnswerItem>>([])
    const [componentJson, setComponentJson] = useState<Array<Question>>([])
    function setAnswer(id: number, answer: string) {
        setAnswers(answers.map(item => item.id === id ? ({
            id,
            answer
        }) : item))

    }
    async function getExamDetail() {
        if (!id) {
            return;
        }
        try {
            const res = await examFind(+id);
            if (res.status === 201 || res.status === 200) {
                try {
                    const content = JSON.parse(res.data.content);
                    const _answers = content.map(item => ({
                        id: item.id,
                    }))
                    setAnswers(_answers)
                    setComponentJson(content)
                } catch (e) {
                    console.error('e', e)
                }
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
                    <Radio.Group onChange={e => setAnswer(item.id, e.target.value)}>
                        {item.options?.map((option) => (
                            <Radio value={option}>{option}</Radio>
                        ))}
                    </Radio.Group>
                );
            } else if (item.type === "checkbox") {
                formComponent = <Checkbox.Group options={item.options} onChange={values => setAnswer(item.id, values.join(','))} />;
            } else if (item.type === "input") {
                formComponent = <Input onChange={e => setAnswer(item.id, e.target.value)} />;
            }
            return <div className="component-item" key={item.id}>
                <p className="question">{item.question}</p>
                <div className="options">
                    {formComponent}
                </div>
            </div>
        });
    }
    const addAnswer = async () => {
        if (!id) return;
        try {
            const res = await answerAdd({
                examId: Number(id),
                content: JSON.stringify(answers)
            });

            if (res.status === 201 || res.status === 200) {
                try {
                    message.success('提交成功');
                    navigate('/res/' + res.data.id);
                } catch (e) {
                    console.error('e', e)
                }
            }
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }
    return <div className="exam-container">
        {renderComponents(componentJson)}
        <Button type="primary" className="btn" onClick={addAnswer}>提交</Button>
    </div>
}

