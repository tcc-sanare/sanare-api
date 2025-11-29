import { BloodType } from "../medical/enterprise/entities/medical-record"
import { MedicineAlarm } from "../medical/enterprise/entities/medicine-alarm"

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
  message: string
  userHistory?: Message[]
  userData?: {
    name: string,
    bloodType: BloodType,
    allergies: string[],
    chronicDiseases: string[]
    medicineAlarms: MedicineAlarm[]
  }
}

type Weekdays = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"

export interface GeminiChatResponse {
  text: string
  functionUsed?: {
    name: string
    weekdays: Weekdays[]
    hours: string[]
    type: "medicine" | "medical-consultation"
    success: string
    failure: string
  }
}
// Record<string, number>
export interface CreateMedicalReportData {
  bloodPressure: { status: string, average: string, systolicAverage: number, diastolicAverage: number, totalLogs: number}
  symptoms: { countSymptoms: {}, totalLogs: number }
  bloodSugar: {
    averageBloodSugar: number,
    minBloodSugar: number,
    maxBloodSugar: number,
    totalLogs: number
  }
  mood: { countHumor: {}, totalLogs: number }
  hydration: { averageLitersHydration: number, totalLogs: number }
  heartRate: {
    averageHeartRate: number,
    minHeartRate: number,
    maxHeartRate: number,
    totalLogs: number
  }
  timeRegistered: {
    firstDate: Date,
    lastDate: Date,
    diffDays: number,
    year: number,
    month: string
    totalLogs: number
  }
}

interface BloodPressureMetrics {
  averageBloodPressure: string
  averageSystolic: number
  averageDiastolic: number
  message: string
}

interface BloodSugarMetrics {
  averageBloodSugar: number
  minBloodSugar: number
  maxBloodSugar: number
  message: string
}

interface HydrationMetrics {
  averageHydration: number
  message: string
}

interface SymptomsMetrics {
  message: string
  symptomsList: string
}

interface HeartRateMetrics {
  averageHeartRate: number
  minHeartRate: number
  maxHeartRate: number
  message: string
}

interface TimeRegistered {
  month: string
  totalLogs: number
  year: number
}

interface MoodMetrics {
  moodsList: string 
  message: string
}

export interface HealthReport {
  bloodPressure: BloodPressureMetrics
  bloodSugar: BloodSugarMetrics
  hydration: HydrationMetrics
  symptoms: SymptomsMetrics
  heartRate: HeartRateMetrics
  timeRegistered: TimeRegistered
  mood: MoodMetrics
}

export abstract class Gemini {
  abstract checkPost(props: PostCheckProps): Promise<Boolean>
  abstract chat(props: ChatProps): Promise<GeminiChatResponse>
  abstract generateMedicalReport(props: CreateMedicalReportData): Promise<HealthReport>
}