export type Question =  {
    id: number
    question: string
    type: 'radio' | 'checkbox' | 'input' 
    options?: string[]
    score: number
    answer: string
    answerAnalyse: string
}