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
import { CreatePostController } from './controllers/community/post/create-post-controller';
import { DeletePostController } from './controllers/community/post/delete-post-controller';
import { GetPostByIdController } from './controllers/community/post/get-post-by-id-controller';
import { UpdatePostController } from './controllers/community/post/update-post-controller';
import { CreateForumController } from './controllers/community/forum/create-forum-controller';
import { DeleteForumController } from './controllers/community/forum/delete-forum-controller';
import { GetAllForumsController } from './controllers/community/forum/get-all-forums-controller';
import { GetForumByIdController } from './controllers/community/forum/get-forum-by-id-controller';
import { UpdateForumController } from './controllers/community/forum/update-forum-controller';
import { CreatePostUseCase } from '@/domain/community/application/use-cases/post/create-post-use-case';
import { DeletePostUseCase } from '@/domain/community/application/use-cases/post/delete-post-use-case';
import { GetPostByIdUseCase } from '@/domain/community/application/use-cases/post/get-post-by-id-use-case';
import { GetPostsByForumIdUseCase } from '@/domain/community/application/use-cases/post/get-posts-by-forum-id-use-case';
import { UpdatePostUseCase } from '@/domain/community/application/use-cases/post/update-post-use-case';
import { CreateForumUseCase } from '@/domain/community/application/use-cases/forum/create-forum-use-case';
import { DeleteForumUseCase } from '@/domain/community/application/use-cases/forum/delete-forum-use-case';
import { GetAllForumsUseCase } from '@/domain/community/application/use-cases/forum/get-all-forums-use-case';
import { GetForumByIdUseCase } from '@/domain/community/application/use-cases/forum/get-forum-by-id-use-case';
import { UpdateForumUseCase } from '@/domain/community/application/use-cases/forum/update-forum-use-case';
import { CreateCommunityNoteController } from './controllers/community/community-note/create-community-note-controller';
import { DeleteCommunityNoteController } from './controllers/community/community-note/delete-community-note-controller';
import { GetAllCommunityNotesByPostIdController } from './controllers/community/community-note/get-all-community-notes-by-post-id-controller';
import { GetCommunityNoteByIdController } from './controllers/community/community-note/get-community-note-by-id-controller';
import { UpdateCommunityNoteController } from './controllers/community/community-note/update-community-note-controller';
import { CreateCommunityNoteUseCase } from '@/domain/community/application/use-cases/community-note/create-community-note-use-case';
import { DeleteCommunityNoteUseCase } from '@/domain/community/application/use-cases/community-note/delete-community-note-use-case';
import { GetAllCommunityNotesByPostIdUseCase } from '@/domain/community/application/use-cases/community-note/get-all-community-notes-by-post-id-use-case';
import { GetCommunityNoteByIdUseCase } from '@/domain/community/application/use-cases/community-note/get-community-note-by-id-use-case';
import { UpdateCommunityNoteUseCase } from '@/domain/community/application/use-cases/community-note/update-community-note-use-case';
import { SavePostController } from './controllers/community/post/save-post-controller';
import { RateCommunityNoteController } from './controllers/community/community-note/rate-community-note-controller';
import { SaveForumController } from './controllers/community/forum/save-forum-controller';
import { Gemini } from '@/domain/gemini-ai/gemini-ai';
import { GeminiService } from '../gemini/gemini-service';
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
import { GetFileController } from './controllers/files/get-file-controller';
import { MailProvider } from '@/domain/mail-provider/mail-provider';
import { MailSender } from '../mail-sender/mail-sender';
import { ChangePasswordUseCase } from '@/domain/account/user/application/use-cases/forgot-password/change-password-use-case';
import { SendForgotPasswordCodeUseCase } from '@/domain/account/user/application/use-cases/forgot-password/send-forgot-password-code-use-case';
import { ValidateForgotPasswordCodeUseCase } from '@/domain/account/user/application/use-cases/forgot-password/validate-forgot-password-code-use-case';
import { SendForgotPasswordCodeController } from './controllers/account/forgot-password/send-forgot-password-code-controller';
import { ValidateForgotPasswordCodeController } from './controllers/account/forgot-password/validate-forgot-password-code-controller';
import { ChangePasswordController } from './controllers/account/forgot-password/change-password-controller';
import { DisconnectSelfMonitorFromCaregiverUseCase } from '@/domain/medical/application/use-cases/caregiver/disconnect-self-monitor-from-caregiver-use-case';
import { GetSelfMonitorAccessUseCase } from '@/domain/medical/application/use-cases/caregiver/get-self-monitor-access-use-case';
import { DisconnectSelfMonitorController } from './controllers/medical/caregiver/disconnect-self-monitor-controller';
import { GetSelfMonitorAccessController } from './controllers/medical/caregiver/get-self-monitor-access-controller';
import { SignOutController } from './controllers/account/user/sign-out-controller';
import { GetNotificationsController } from './controllers/account/notification/get-notifications-controller';
import { DeleteNotificationController } from './controllers/account/notification/delete-notification-controller';
import { GetNotificationByIdController } from './controllers/account/notification/get-notification-by-id-controller';
import { UpdateDeviceUseCase } from '@/domain/account/user/application/use-cases/device/update-device-use-case';
import { DeleteDeviceUseCase } from '@/domain/account/user/application/use-cases/device/delete-device-use-case';
import { GetDeviceByTokenUseCase } from '@/domain/account/user/application/use-cases/device/get-device-by-token-use-case';
import { GetNotificationsByAccountIdUseCase } from '@/domain/account/user/application/use-cases/notification/get-notifications-by-account-id-use-case';
import { GetNotificationByIdUseCase } from '@/domain/account/user/application/use-cases/notification/get-notification-by-id-use-case';
import { DeleteNotificationUseCase } from '@/domain/account/user/application/use-cases/notification/delete-notification-use-case';
import { CloudMessaging } from '../cloud-messaging/cloud-messaging';
import { NotificationProvider } from '@/domain/notification-provider/notification-provider';
import { GetDevicesByUserIdUseCase } from '@/domain/account/user/application/use-cases/device/get-devices-by-user-id';

@Module({
  controllers: [
    // Files
      GetFileController,
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
        SignOutController,
      // Notification
        GetNotificationsController,
        GetNotificationByIdController,
        DeleteNotificationController,
      // Forgot Password
        SendForgotPasswordCodeController,
        ValidateForgotPasswordCodeController,
        ChangePasswordController,
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
        DisconnectSelfMonitorController,
        GetSelfMonitorAccessController,
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
    // Community

      //Post
        CreatePostController,
        DeletePostController,
        // GetAllPostsByForumIdController,
        SavePostController,
        GetPostByIdController,
        UpdatePostController,
      // Forum
        CreateForumController,
        DeleteForumController,
        GetAllForumsController,
        GetForumByIdController,
        UpdateForumController,
        SaveForumController,
      // Community Notes
        CreateCommunityNoteController,
        DeleteCommunityNoteController,
        GetAllCommunityNotesByPostIdController,
        GetCommunityNoteByIdController,
        UpdateCommunityNoteController,
        RateCommunityNoteController
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
        DisconnectSelfMonitorFromCaregiverUseCase,
        GetSelfMonitorAccessUseCase,
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

    // Community

      // Post
        CreatePostUseCase,
        DeletePostUseCase,
        GetPostByIdUseCase,
        GetPostsByForumIdUseCase,
        UpdatePostUseCase,

      // Forum
        CreateForumUseCase,
        DeleteForumUseCase,
        GetAllForumsUseCase,
        GetForumByIdUseCase,
        UpdateForumUseCase,
      
      // Community Notes
        CreateCommunityNoteUseCase,
        DeleteCommunityNoteUseCase,
        GetAllCommunityNotesByPostIdUseCase,
        GetCommunityNoteByIdUseCase,
        UpdateCommunityNoteUseCase,

        UpdateAccountEmailUseCase,
      // Forgot Password
        ChangePasswordUseCase,
        SendForgotPasswordCodeUseCase,
        ValidateForgotPasswordCodeUseCase,
      // Device
        GetDeviceByTokenUseCase,
        GetDevicesByUserIdUseCase,
        UpdateDeviceUseCase,
        DeleteDeviceUseCase,
      // Notification
        GetNotificationsByAccountIdUseCase,
        GetNotificationByIdUseCase,
        DeleteNotificationUseCase,
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
    },
    {
      provide: Gemini,
      useClass: GeminiService
    }
      provide: MailProvider,
      useClass: MailSender
    },
    {
      provide: NotificationProvider,
      useClass: CloudMessaging
    },
    GoogleDrive
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
