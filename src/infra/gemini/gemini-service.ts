import { ChatProps, Gemini, PostCheckProps } from "@/domain/gemini-ai/gemini-ai";
import { Injectable } from "@nestjs/common";

interface GeminiChatResponse {
  yourAnswer: string
}

@Injectable()
export class GeminiService implements Gemini {
  constructor() {}

  async chat(props: ChatProps): Promise<String> {

    const result: GeminiChatResponse = await fetch('https://san-ai-sigma.vercel.app/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: props.question,
        history: props.history,
        medicalRecord: {
          role: 'user',
          parts: [{
            text: props.medicalRecord
          }]
        }
      })
    }).then(res => res.json())
    console.log(result)

    // Verificar erro
    return result.yourAnswer

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


}