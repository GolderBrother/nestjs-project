import { Question } from "./type";

export const COMPONENT_JSON: Array<Question> = [
    {
        id: 1,
        type: "radio",
        question: "最长的河？",
        options: [
            "选项1",
            "选项2"
        ],
        score: 5,
        answer: "选项1",
        answerAnalyse: "答案解析"
    },
    {
        id: 2,
        type: "checkbox",
        question: "最高的山？",
        options: [
            "选项1",
            "选项2"
        ],
        score: 5,
        answer: "选项1",
        answerAnalyse: "答案解析"
    },
    {
        id: 2,
        type: "input",
        question: "测试问题",
        score: 5,
        answer: "选项1",
        answerAnalyse: "答案解析"
    },

]