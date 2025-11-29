import { ChatProps, CreateMedicalReportData, Gemini, GeminiChatResponse, HealthReport, PostCheckProps } from "@/domain/gemini-ai/gemini-ai";
import { Injectable } from "@nestjs/common";


interface MedicalReportModelResponse {
  name: string,
  args: HealthReport
}

@Injectable()
export class GeminiService implements Gemini {
  constructor() {}

  async chat(props: ChatProps): Promise<GeminiChatResponse> {

    const result = await fetch('https://san-ai-sigma.vercel.app/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: props.message,
        userHistory: props.userHistory,
        userData: JSON.stringify(props.userData)
      })
    }).then(res => res.json())
    return result

  }

  async checkPost(props: PostCheckProps): Promise<Boolean> {
      const result: Boolean = await fetch('https://san-ai-sigma.vercel.app/post-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: props.content
        })
      }).then(res => res.json())
  
      return result
  }

  async generateMedicalReport(props: CreateMedicalReportData): Promise<HealthReport> {
    const result: MedicalReportModelResponse = await fetch('https://san-ai-sigma.vercel.app/medical-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: JSON.stringify(props)
      })
    }).then(res => res.json())
    return result.args
  }
}