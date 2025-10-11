import { Module } from '@nestjs/common';
import { GetAllAllergiesController } from './controllers/medical/allergy/get-all-allergies-controller';
import { DatabaseModule } from '../database/database.module';
import { GetAllAllergiesUseCase } from '@/domain/medical/application/use-cases/allergy/get-all-allergies-use-case';
import { GetAllergyByIdController } from './controllers/medical/allergy/get-allergy-by-id-controller';
import { GetAllergyByIdUseCase } from '@/domain/medical/application/use-cases/allergy/get-allergy-by-id-use-case';
import { GetAllergiesByNameUseCase } from '@/domain/medical/application/use-cases/allergy/get-allergies-by-name-use-case';
import { CreateAllergyController } from './controllers/medical/allergy/create-allergy-controller';
import { CreateAllergyUseCase } from '@/domain/medical/application/use-cases/allergy/create-allergy-use-case';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { Storage } from '@/domain/application/storage';
import { GetChronicDiseasesController } from './controllers/medical/chronic-disease/get-all-chronic-diseases-controller';
import { GetAllChronicDiseasesUseCase } from '@/domain/medical/application/use-cases/chronic-disease/get-all-chronic-diseases-use-case';
import { GetChronicDiseasesByNameUseCase } from '@/domain/medical/application/use-cases/chronic-disease/get-chronic-diseases-by-name-use-case';
import { GetChronicDiseaseById } from './controllers/medical/chronic-disease/get-chronic-disease-by-id-controller';
import { GetChronicDiseaseByIdUseCase } from '@/domain/medical/application/use-cases/chronic-disease/get-chronic-disease-by-id-use-case';
import { CreateChronicDiseaseController } from './controllers/medical/chronic-disease/create-chronic-disease-controller';
import { CreateChronicDiseaseUseCase } from '@/domain/medical/application/use-cases/chronic-disease/create-chronic-disease-use-case';
import { CreateAccountController } from './controllers/account/user/create-account-controller';
import { CreateAccountUseCase } from '@/domain/account/user/application/use-cases/account/create-account-use-case';
import { Encrypter } from '@/domain/account/cryptography/encrypter';
import { JwtEncrypter } from '../cryptography/jwt-encrypter';
import { HashGenerator } from '@/domain/account/cryptography/hash-generetor';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { HashComparer } from '@/domain/account/cryptography/hash-comparer';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticateAccountController } from './controllers/account/user/authenticate-account-controller';
import { AuthenticateAccountUseCase } from '@/domain/account/user/application/use-cases/account/authenticate-account-use-case';
import { GetAccountController } from './controllers/account/user/get-account-controller';
import { GetMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/get-my-account-use-case';
import { CreateSelfMonitorUseCase } from '@/domain/medical/application/use-cases/self-monitor/create-self-monitor-use-case';
import { CreateSelfMonitorController } from './controllers/medical/self-monitor/create-self-monitor-controller';
import { GetSelfMonitorController } from './controllers/medical/self-monitor/get-self-monitor-controller';
import { GetSelfMonitorByAccountIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case';
import { GoogleDrive } from '../storage/google-drive';
import { UpdateProfilePhotoAccountController } from './controllers/account/user/update-profile-photo-account-controller';
import { UpdateMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/update-my-account-use-case';
import { CreateCaregiverController } from './controllers/medical/caregiver/create-caregiver-controller';
import { CreateCaregiverUseCase } from '@/domain/medical/application/use-cases/caregiver/create-caregiver-use-case';
import { GetCaregiverByUserIdController } from './controllers/medical/caregiver/get-caregiver-by-id-controller';
import { GetCaregiverByUserIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case';
import { GetSelfMonitorByCaregiverIdController } from './controllers/medical/caregiver/get-self-monitor-by-caregiver-controller';
import { GetSelfMonitorsByCaregiverIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitors-by-caregiver-id-use-case';
import { GetCaregiverByCaregiverCodeUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-caregiver-code-use-case';
import { ConnectCaregiverToSelfMonitorController } from './controllers/medical/self-monitor/connect-caregiver-to-self-monitor-controller';
import { UpdateSelfMonitorUseCase } from '@/domain/medical/application/use-cases/self-monitor/update-self-monitor-use-case';
import { CreateMedicalRecordUseCase } from '@/domain/medical/application/use-cases/medical-record/create-medical-record-use-case';
import { CreateaMedicalRecordController } from './controllers/medical/medical-record/create-medical-record-controller';
import { GetMedicalRecordBySelfMonitorIdUseCase } from '@/domain/medical/application/use-cases/medical-record/get-medical-record-by-self-monitor-id';
import { GetMedicalRecordController } from './controllers/medical/medical-record/get-medical-record-controller';
import { UpdateMedicalRecordController } from './controllers/medical/medical-record/update-medical-record-controller';
import { UpdateMedicalRecordUseCase } from '@/domain/medical/application/use-cases/medical-record/update-medical-record-use-case';
import { DeleteAllergyController } from './controllers/medical/allergy/delete-allergy-controller';
import { DeleteAllergyUseCase } from '@/domain/medical/application/use-cases/allergy/delete-allergy-use-case';
import { DeleteChronicDiseaseUseCase } from '@/domain/medical/application/use-cases/chronic-disease/delete-chronic-disease-use-case';
import { DeleteChronicDiseaseController } from './controllers/medical/chronic-disease/delete-chronic-disease-controller';
import { UpdateChronicDiseaseController } from './controllers/medical/chronic-disease/update-chronic-disease-controller';
import { UpdateChronicDiseaseUseCase } from '@/domain/medical/application/use-cases/chronic-disease/update-chronic-disease-use-case';
import { MulterModule } from '@nestjs/platform-express';
import { UpdateSelfMonitorController } from './controllers/medical/self-monitor/update-self-monitor-controller';
import { CreateSymptomUseCase } from '@/domain/medical/application/use-cases/symptom/create-symptom-use-case';
import { DeleteSymptomUseCase } from '@/domain/medical/application/use-cases/symptom/delete-symptom-use-case';
import { GetAllSymptomsUseCase } from '@/domain/medical/application/use-cases/symptom/get-all-symptoms-use-case';
import { GetSymptomByIdUseCase } from '@/domain/medical/application/use-cases/symptom/get-symptom-by-id-use-case';
import { GetSymptomByNameUseCase } from '@/domain/medical/application/use-cases/symptom/get-symptoms-by-name-use-case';
import { CreateDiseaseUseCase } from '@/domain/medical/application/use-cases/disease/create-disease-use-case';
import { DeleteDiseaseUseCase } from '@/domain/medical/application/use-cases/disease/delete-disease-use-case';
import { GetAllDiseasesUseCase } from '@/domain/medical/application/use-cases/disease/get-all-disease-use-case';
import { GetDiseaseByIdUseCase } from '@/domain/medical/application/use-cases/disease/get-disease-by-id-use-case';
import { GetDiseasesByNameUseCase } from '@/domain/medical/application/use-cases/disease/get-diseases-by-name-use-case';
import { CreateMedicalLogUseCase } from '@/domain/medical/application/use-cases/medical-log/create-medical-log-use-case';
import { UpdateSymptomUsecase } from '@/domain/medical/application/use-cases/symptom/update-symptom-use-case';
import { UpdateDiseaseUseCase } from '@/domain/medical/application/use-cases/disease/update-disease-use-case';
import { GetMedicalLogBySelfMonitorIdUseCase } from '@/domain/medical/application/use-cases/medical-log/get-medical-log-by-self-monitor-id-use-case';
import { UpdateMedicalLogUseCase } from '@/domain/medical/application/use-cases/medical-log/update-medical-log-use-case';
import { GetMedicalLogByIdUseCase } from '@/domain/medical/application/use-cases/medical-log/get-medical-log-by-id-use-case';
import { CreateSymptomController } from './controllers/medical/symptom/create-symptom-controller';
import { DeleteSymptomController } from './controllers/medical/symptom/delete-symptom-controller';
import { GetAllSymptomsController } from './controllers/medical/symptom/get-all-symptoms-controller';
import { GetSymptomByIdController } from './controllers/medical/symptom/get-symptom-by-id-controller';
import { UpdateSymptomController } from './controllers/medical/symptom/update-symptom-controller';
import { CrerateDiseaseController } from './controllers/medical/disease/create-disease-controller';
import { DeleteDiseaseController } from './controllers/medical/disease/delete-disease-controller';
import { GetAllDiseasesController } from './controllers/medical/disease/get-all-diseases-controller';
import { GetDiseaseByIdController } from './controllers/medical/disease/get-disease-by-id-controller';
import { UpdateDiseaseController } from './controllers/medical/disease/update-disease-controller';
import { CreateMedicalLogController } from './controllers/medical/medical-log/create-medical-log-controller';
import { GetMedicalLogsController } from './controllers/medical/medical-log/get-medical-logs-controller';
import { UpdateMedicalLogController } from './controllers/medical/medical-log/update-medical-log-controller';
import { CreateCaregiverRequestUseCase } from '@/domain/medical/application/use-cases/caregiver-request/create-caregiver-request-use-case';
import { GetCaregiverRequestBySelfMonitorUseCase } from '@/domain/medical/application/use-cases/caregiver-request/get-caregiver-request-by-self-monitor-use-case';
import { GetCaregiverRequestsByCaregiverUseCase } from '@/domain/medical/application/use-cases/caregiver-request/get-caregiver-requests-by-caregiver-use-case';
import { UpdateCaregiverRequestUseCase } from '@/domain/medical/application/use-cases/caregiver-request/update-caregiver-request-use-case';
import { GetSelfMonitorRequestsController } from './controllers/medical/caregiver/get-self-monitor-requests-controller';
import { GetCaregiverRequestsController } from './controllers/medical/self-monitor/get-caregiver-requests-controller';
import { RespondSelfMonitorRequestController } from './controllers/medical/caregiver/respond-self-monitor-request-controller';
import { DeleteCaregiverRequestUseCase } from '@/domain/medical/application/use-cases/caregiver-request/delete-caregiver-request-use-case';
import { CancelCaregiverRequestController } from './controllers/medical/self-monitor/cancel-caregiver-request-controller';
import { GetSelfMonitorByIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-id-use-case';
import { CheckExistingEmailUseCase } from '@/domain/account/user/application/use-cases/account/check-existing-email-use-case';
import { CheckExistingEmailController } from './controllers/account/user/check-existing-email-controller';
import { UpdateAccountEmailUseCase } from '@/domain/account/user/application/use-cases/account/update-account-email-use-case';
import { UpdateAccountController } from './controllers/account/user/update-account-controller';
import { CreateMedicineAlarmController } from './controllers/medical/medicine-alarms/create-medicine-alarm-controller';
import { GetMedicineAlarmByIdController } from './controllers/medical/medicine-alarms/get-medicine-alarm-by-id-controller';
import { GetMedicineAlarmsController } from './controllers/medical/medicine-alarms/get-medicine-alarms-controller';
import { UpdateMedicineAlarmController } from './controllers/medical/medicine-alarms/update-medicine-alarm-controller';
import { DeleteMedicineAlarmController } from './controllers/medical/medicine-alarms/delete-medicine-alarm-controller';
import { CreateMedicineAlarmUseCase } from '@/domain/medical/application/use-cases/medicine-alarm/create-medicine-alarm-use-case';
import { GetMedicineAlarmByIdUseCase } from '@/domain/medical/application/use-cases/medicine-alarm/get-medicine-alarm-by-id-use-case';
import { GetMedicineAlarmsBySelfMonitorIdUseCase } from '@/domain/medical/application/use-cases/medicine-alarm/get-medicine-alarms-by-self-monitor-id-use-case';
import { UpdateMedicineAlarmUseCase } from '@/domain/medical/application/use-cases/medicine-alarm/update-medicine-alarm-use-case';
import { DeleteMedicineAlarmUseCase } from '@/domain/medical/application/use-cases/medicine-alarm/delete-medicine-alarm-use-case';
import { DeleteCaregiverUseCase } from '@/domain/medical/application/use-cases/caregiver/delete-caregiver-use-case';
import { DeleteCaregiverController } from './controllers/medical/caregiver/delete-caregiver-controller';
import { DeleteSelfMonitorController } from './controllers/medical/self-monitor/delete-self-monitor-controller';
import { DeleteSelfMonitorUseCase } from '@/domain/medical/application/use-cases/self-monitor/delete-self-monitor-use-case';
import { GetProfileController } from './controllers/account/profile/get-profile-controller';
import { ChangeProfileController } from './controllers/account/profile/change-profile-controller';
import { GetProfileUseCase } from '@/domain/account/user/application/use-cases/profile/get-profile-use-case';
import { ChangeProfileUseCase } from '@/domain/account/user/application/use-cases/profile/change-profile-use-case';
import { GetCaregiverByIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-id-use-case';

@Module({
  controllers: [
    // Medical
      // Allergy
        GetAllAllergiesController,
        GetAllergyByIdController,
        CreateAllergyController,
        DeleteAllergyController,
      // ChronicDisease
        GetChronicDiseasesController,
        GetChronicDiseaseById,
        CreateChronicDiseaseController,
        DeleteChronicDiseaseController,
        UpdateChronicDiseaseController,
    // User
      // Profile
        GetProfileController,
        ChangeProfileController,
      // Account
        CreateAccountController,
        AuthenticateAccountController,
        GetAccountController,
        CheckExistingEmailController,
        UpdateProfilePhotoAccountController,
        UpdateAccountController,
      //Self Monitor
        CreateSelfMonitorController,
        GetSelfMonitorController,
        GetSelfMonitorByCaregiverIdController,
        ConnectCaregiverToSelfMonitorController,
        UpdateSelfMonitorController,
        GetCaregiverRequestsController,
        CancelCaregiverRequestController,
        DeleteSelfMonitorController,
      //Caregiver
        CreateCaregiverController,
        GetCaregiverByUserIdController,
        RespondSelfMonitorRequestController,
        GetSelfMonitorRequestsController,
        DeleteCaregiverController,
      //MedicalRecord
        CreateaMedicalRecordController,
        GetMedicalRecordController,
        UpdateMedicalRecordController,
      //Symptom
        CreateSymptomController,
        DeleteSymptomController,
        GetAllSymptomsController,
        GetSymptomByIdController,
        UpdateSymptomController,
      //Disease
        CrerateDiseaseController,
        DeleteDiseaseController,
        GetAllDiseasesController,
        GetDiseaseByIdController,
        UpdateDiseaseController,
      //MedicalLog
        CreateMedicalLogController,
        GetMedicalLogsController,
        UpdateMedicalLogController,
      //MedicineAlarm
        CreateMedicineAlarmController,
        GetMedicineAlarmByIdController,
        GetMedicineAlarmsController,
        UpdateMedicineAlarmController,
        DeleteMedicineAlarmController
  ],
  providers: [
    // Medical
      // Allergy
        GetAllAllergiesUseCase,
        GetAllergiesByNameUseCase,
        GetAllergyByIdUseCase,
        CreateAllergyUseCase,
        DeleteAllergyUseCase,
      // ChronicDisease
        GetAllChronicDiseasesUseCase,
        GetChronicDiseasesByNameUseCase,
        GetChronicDiseaseByIdUseCase,
        CreateChronicDiseaseUseCase,
        DeleteChronicDiseaseUseCase,
        UpdateChronicDiseaseUseCase,
      // Self Monitor
        CreateSelfMonitorUseCase,
        GetSelfMonitorByAccountIdUseCase,
        GetSelfMonitorsByCaregiverIdUseCase,
        GetSelfMonitorByIdUseCase,
        UpdateSelfMonitorUseCase,
        DeleteSelfMonitorUseCase,
      //Caregiver
        CreateCaregiverUseCase,
        GetCaregiverByIdUseCase,
        GetCaregiverByUserIdUseCase,
        GetCaregiverByCaregiverCodeUseCase,
        DeleteCaregiverUseCase,
      //MedicalRecord
        CreateMedicalRecordUseCase,
        GetMedicalRecordBySelfMonitorIdUseCase,
        UpdateMedicalRecordUseCase,
      //Symptom
        CreateSymptomUseCase,
        DeleteSymptomUseCase,
        GetAllSymptomsUseCase,
        GetSymptomByIdUseCase,
        GetSymptomByNameUseCase,
        UpdateSymptomUsecase,
      //Disease
        CreateDiseaseUseCase,
        DeleteDiseaseUseCase,
        GetAllDiseasesUseCase,
        GetDiseaseByIdUseCase,
        GetDiseasesByNameUseCase,
        UpdateDiseaseUseCase,
      //MedicalLog
        CreateMedicalLogUseCase,
        CreateMedicalLogUseCase,
        GetMedicalLogBySelfMonitorIdUseCase,
        UpdateMedicalLogUseCase,
        GetMedicalLogByIdUseCase,
        
      //CaregiverRequest
        CreateCaregiverRequestUseCase,
        GetCaregiverRequestBySelfMonitorUseCase,
        GetCaregiverRequestsByCaregiverUseCase,
        UpdateCaregiverRequestUseCase,
        DeleteCaregiverRequestUseCase,

      //MedicineAlarm
        CreateMedicineAlarmUseCase,
        GetMedicineAlarmByIdUseCase,
        GetMedicineAlarmsBySelfMonitorIdUseCase,
        UpdateMedicineAlarmUseCase,
        DeleteMedicineAlarmUseCase,
    // User
      // Profile
         GetProfileUseCase,
         ChangeProfileUseCase,
      // Account
        CreateAccountUseCase,
        AuthenticateAccountUseCase,
        GetMyAccountUseCase,
        CheckExistingEmailUseCase,
        UpdateMyAccountUseCase,
        UpdateAccountEmailUseCase,

    {
      provide: Storage,
      useClass: InMemoryStorage
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher
    },
    {
      provide: Storage,
      useClass: GoogleDrive
    }
  ],
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secretOrPrivateKey: process.env.JWT_SECRET
    }),
    MulterModule.register()
  ],
})
export class HttpModule {}
