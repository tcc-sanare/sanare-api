-- DropForeignKey
ALTER TABLE "public"."medical_logs_to_diseases" DROP CONSTRAINT "medical_logs_to_diseases_diseaseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_logs_to_diseases" DROP CONSTRAINT "medical_logs_to_diseases_medicalLogId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_logs_to_symptoms" DROP CONSTRAINT "medical_logs_to_symptoms_medicalLogId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_logs_to_symptoms" DROP CONSTRAINT "medical_logs_to_symptoms_symptomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_record_to_allergies" DROP CONSTRAINT "medical_record_to_allergies_allergyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_record_to_allergies" DROP CONSTRAINT "medical_record_to_allergies_medicalRecordId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_record_to_chronic_diseases" DROP CONSTRAINT "medical_record_to_chronic_diseases_chronicDiseaseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_record_to_chronic_diseases" DROP CONSTRAINT "medical_record_to_chronic_diseases_medicalRecordId_fkey";

-- AddForeignKey
ALTER TABLE "public"."medical_record_to_allergies" ADD CONSTRAINT "medical_record_to_allergies_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "public"."medical_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_record_to_allergies" ADD CONSTRAINT "medical_record_to_allergies_allergyId_fkey" FOREIGN KEY ("allergyId") REFERENCES "public"."allergies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_record_to_chronic_diseases" ADD CONSTRAINT "medical_record_to_chronic_diseases_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "public"."medical_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_record_to_chronic_diseases" ADD CONSTRAINT "medical_record_to_chronic_diseases_chronicDiseaseId_fkey" FOREIGN KEY ("chronicDiseaseId") REFERENCES "public"."chronic_diseases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_logs_to_diseases" ADD CONSTRAINT "medical_logs_to_diseases_medicalLogId_fkey" FOREIGN KEY ("medicalLogId") REFERENCES "public"."medical_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_logs_to_diseases" ADD CONSTRAINT "medical_logs_to_diseases_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "public"."diseases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_logs_to_symptoms" ADD CONSTRAINT "medical_logs_to_symptoms_medicalLogId_fkey" FOREIGN KEY ("medicalLogId") REFERENCES "public"."medical_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_logs_to_symptoms" ADD CONSTRAINT "medical_logs_to_symptoms_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "public"."symptoms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
