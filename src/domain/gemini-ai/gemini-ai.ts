import { BloodType } from "../medical/enterprise/entities/medical-record"

export interface PostCheckProps {
  content: string
}

interface Message {
  role: 'user' | 'model'
  parts: [{
    text: string
  }]
}

export interface ChatProps {
  question: string
  history?: Message[]
  medicalRecord?: {
    name: string,
    bloodType: BloodType,
    allergies: string[],
    chronicDiseases: string[]
  }
}

export abstract class Gemini {
  abstract checkPost(props: PostCheckProps): Promise<Boolean>
  abstract chat(props: ChatProps): Promise<String>
}