export interface LongAnswer {
    token: string,
    question: string,
    context: string,
    auth?: string
}

export interface HelpfullLongQuestion {
    token: string,
    question: string,
    auth?: string
}