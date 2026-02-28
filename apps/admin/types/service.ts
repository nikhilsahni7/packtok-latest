// Service Types and Enums
export enum ServiceType {
  MAINTENANCE = "MAINTENANCE",
  CONSULTANCY = "CONSULTANCY",
  TURNKEY_PROJECT = "TURNKEY_PROJECT",
  COMPANY_ACQUISITION = "COMPANY_ACQUISITION",
  MANPOWER_HIRING = "MANPOWER_HIRING",
  JOB_SEEKER_SUBMISSION = "JOB_SEEKER_SUBMISSION",
}

export enum ServiceStatus {
  SUBMITTED = "SUBMITTED",
  AWAITING_ASSIGNMENT = "AWAITING_ASSIGNMENT",
  IN_REVIEW = "IN_REVIEW",
  ACTION_REQUIRED = "ACTION_REQUIRED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export enum MaintenanceRequestType {
  PREVENTIVE = "PREVENTIVE",
  CORRECTIVE = "CORRECTIVE",
  PREDICTIVE = "PREDICTIVE",
  EMERGENCY = "EMERGENCY",
}

export enum IndustryType {
  MANUFACTURING = "MANUFACTURING",
  AUTOMOTIVE = "AUTOMOTIVE",
  FOOD_PROCESSING = "FOOD_PROCESSING",
  PHARMACEUTICALS = "PHARMACEUTICALS",
  AGRICULTURE = "AGRICULTURE",
  CHEMICALS = "CHEMICALS",
  PETROCHEMICALS = "PETROCHEMICALS",
  TEXTILE = "TEXTILE",
  PLASTICS_PACKAGING = "PLASTICS_PACKAGING",
  ELECTRONICS = "ELECTRONICS",
  OTHER = "OTHER",
}

export enum ConsultancyServiceType {
  MACHINE_OPTIMIZATION = "MACHINE_OPTIMIZATION",
  AUTOMATION_INTEGRATION = "AUTOMATION_INTEGRATION",
  MAINTENANCE_SUPPORT = "MAINTENANCE_SUPPORT",
  PROCESS_IMPROVEMENT = "PROCESS_IMPROVEMENT",
  CUSTOM_MACHINE_DESIGN = "CUSTOM_MACHINE_DESIGN",
  OPERATOR_TECHNICIAN_TRAINING = "OPERATOR_TECHNICIAN_TRAINING",
  PREDICTIVE_MAINTENANCE_SETUP = "PREDICTIVE_MAINTENANCE_SETUP",
  TECHNOLOGY_INTEGRATION_AI_IOT_ROBOTICS = "TECHNOLOGY_INTEGRATION_AI_IOT_ROBOTICS",
  ENERGY_EFFICIENCY_SUSTAINABILITY = "ENERGY_EFFICIENCY_SUSTAINABILITY",
  OTHER = "OTHER",
}

export enum ConsultancyProjectGoal {
  INCREASE_MACHINE_PRODUCTIVITY = "INCREASE_MACHINE_PRODUCTIVITY",
  REDUCE_DOWNTIME = "REDUCE_DOWNTIME",
  UPGRADE_OLD_MACHINERY = "UPGRADE_OLD_MACHINERY",
  IMPROVE_WORKER_TRAINING = "IMPROVE_WORKER_TRAINING",
  ENHANCE_ENERGY_EFFICIENCY = "ENHANCE_ENERGY_EFFICIENCY",
  INTEGRATE_AUTOMATION_AI = "INTEGRATE_AUTOMATION_AI",
  COMPLY_WITH_INDUSTRY_STANDARDS = "COMPLY_WITH_INDUSTRY_STANDARDS",
  OTHER = "OTHER",
}

export enum TurnkeyFacilityType {
  NEW_PRODUCTION_PLANT = "NEW_PRODUCTION_PLANT",
  EXPANSION_OF_EXISTING_FACILITY = "EXPANSION_OF_EXISTING_FACILITY",
  MODERNIZATION_AUTOMATION = "MODERNIZATION_AUTOMATION",
  OTHER = "OTHER",
}

export enum TurnkeyTimeline {
  MONTHS_0_6 = "MONTHS_0_6",
  MONTHS_6_12 = "MONTHS_6_12",
  YEARS_1_2 = "YEARS_1_2",
  FLEXIBLE_TO_BE_DISCUSSED = "FLEXIBLE_TO_BE_DISCUSSED",
}

export enum SiteAvailability {
  YES = "YES",
  NO = "NO",
  IN_PLANNING = "IN_PLANNING",
}

export enum TurnkeyServiceNeeded {
  FEASIBILITY_STUDY = "FEASIBILITY_STUDY",
  PLANT_DESIGN_ENGINEERING = "PLANT_DESIGN_ENGINEERING",
  EQUIPMENT_PROCUREMENT = "EQUIPMENT_PROCUREMENT",
  MACHINERY_INSTALLATION = "MACHINERY_INSTALLATION",
  AUTOMATION_SOFTWARE_INTEGRATION = "AUTOMATION_SOFTWARE_INTEGRATION",
  PROCESS_OPTIMIZATION = "PROCESS_OPTIMIZATION",
  EMPLOYEE_TRAINING = "EMPLOYEE_TRAINING",
  MAINTENANCE_AFTER_SALES_SUPPORT = "MAINTENANCE_AFTER_SALES_SUPPORT",
  REGULATORY_COMPLIANCE_SETUP = "REGULATORY_COMPLIANCE_SETUP",
  OTHER = "OTHER",
}

export enum TurnkeyBudget {
  UNDER_1M = "UNDER_1M",
  M1_5 = "M1_5",
  M5_10 = "M5_10",
  OVER_10M = "OVER_10M",
  TO_BE_DISCUSSED = "TO_BE_DISCUSSED",
}

export enum FundingStatus {
  FULLY_FUNDED = "FULLY_FUNDED",
  PARTIALLY_FUNDED = "PARTIALLY_FUNDED",
  SEEKING_FINANCING = "SEEKING_FINANCING",
  OTHER = "OTHER",
}

export enum InquirerType {
  BUYER = "BUYER",
  SELLER = "SELLER",
  ADVISOR_CONSULTANT = "ADVISOR_CONSULTANT",
}

export enum TransactionType {
  ASSET_SALE = "ASSET_SALE",
  STOCK_SHARE_SALE = "STOCK_SHARE_SALE",
  MERGER = "MERGER",
  ACQUISITION_TAKEOVER = "ACQUISITION_TAKEOVER",
  NOT_SURE = "NOT_SURE",
}

export enum LegalStructure {
  SOLE_PROPRIETORSHIP = "SOLE_PROPRIETORSHIP",
  PARTNERSHIP = "PARTNERSHIP",
  PVT_LTD = "PVT_LTD",
  PUBLIC = "PUBLIC",
  LLP = "LLP",
  OTHER = "OTHER",
}

export enum ManpowerType {
  MACHINE_OPERATORS = "MACHINE_OPERATORS",
  TECHNICIANS = "TECHNICIANS",
  MAINTENANCE_WORKERS = "MAINTENANCE_WORKERS",
  SUPERVISORS = "SUPERVISORS",
  OTHER = "OTHER",
}

export enum HiringDuration {
  PERMANENT = "PERMANENT",
  CONTRACT = "CONTRACT",
}

export enum UrgencyLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

// Core Service Types
export interface ServiceActionLog {
  id: string;
  createdAt: string;
  action: string;
  notes?: string;
  actor?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MaintenanceRequest {
  id: string;
  maintenanceType: MaintenanceRequestType;
  companyName: string;
  address: string;
  machineName: string;
  machineIdOrSerialNumber: string;
  locationInFacility: string;
  manufacturer?: string;
  installationDate?: string;
  checklistDetails?: Record<string, any>;
  partsReplaced?: Record<string, any>;
  technicianNotes?: string;
  supervisorApprovalName?: string;
}

export interface ConsultancyRequest {
  id: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  companyAddress: string;
  industryType: IndustryType;
  industryOther?: string;
  employeesOperatingMachines?: number;
  machineTypesInUse: string;
  yearsInOperation?: number;
  servicesRequired: ConsultancyServiceType[];
  currentChallenges: string;
  projectGoals: ConsultancyProjectGoal[];
  preferredStartDate?: string;
  expectedCompletionDate?: string;
  estimatedBudget?: string;
  additionalNotes?: string;
}

export interface TurnkeyProjectInquiry {
  id: string;
  contactName: string;
  companyName: string;
  role: string;
  email: string;
  phone: string;
  website?: string;
  industry: IndustryType[];
  facilityType: TurnkeyFacilityType;
  projectDescription: string;
  targetProductionCapacity: string;
  completionTimeline: TurnkeyTimeline;
  siteAvailableStatus: SiteAvailability;
  servicesNeeded: TurnkeyServiceNeeded[];
  powerSupplyAvailable?: string;
  utilitiesAvailable: boolean;
  machineryPreferences?: string;
  estimatedBudget: TurnkeyBudget;
  fundingStatus: FundingStatus;
  requiresOngoingSupport: boolean;
  interestedInFutureUpgrades: boolean;
  specialRequirements?: string;
}

export interface CompanyAcquisitionInquiry {
  id: string;
  contactName: string;
  companyName: string;
  role: string;
  email: string;
  phone: string;
  inquirerType: InquirerType;
  transactionType: TransactionType;
  intendedOutcome?: string;
  sellerBusinessDescription?: string;
  sellerLegalStructure?: LegalStructure;
  sellerIndustrySector?: string;
  sellerYearEstablished?: number;
  sellerAnnualRevenue?: string;
  sellerEbitda?: string;
  sellerKeyAssets?: string;
  buyerPreferredBusinessType?: string;
  buyerTargetSize?: string;
  buyerGeographicPreference?: string;
  buyerOwnershipInterest?: string;
  advisorsEngaged: string[];
  isValued?: boolean;
  hasOngoingLitigation?: boolean;
  litigationDetails?: string;
  hasChangeOfControlClauses?: boolean;
  wantsNda: boolean;
  additionalNotes?: string;
}

export interface ManpowerHiringRequest {
  id: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  companyAddress: string;
  industryType: IndustryType;
  machineryInvolved: string;
  workLocation: string;
  workingHours: string;
  manpowerType: ManpowerType[];
  skilledWorkersRequired: number;
  semiSkilledWorkersRequired: number;
  unskilledWorkersRequired: number;
  hiringDuration: HiringDuration;
  contractDurationDetails?: string;
  requiredCertsAndExp?: string;
  expectedJoiningDate: string;
  hiringUrgency: UrgencyLevel;
  additionalNotes?: string;
}

export interface JobSeekerProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  stateOfResidence: string;
  phone: string;
  alternatePhone?: string;
  positionSought: string;
  otherPosition?: string;
  preferredWorkingMode: string;
  hasPreviouslyWorkedWithUs: boolean;
  previousWorkEndDate?: string;
  cvUrl: string;
}

export interface ServiceRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  serviceType: ServiceType;
  status: ServiceStatus;
  user: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  maintenanceRequest?: MaintenanceRequest;
  consultancyRequest?: ConsultancyRequest;
  turnkeyProjectInquiry?: TurnkeyProjectInquiry;
  companyAcquisitionInquiry?: CompanyAcquisitionInquiry;
  manpowerHiringRequest?: ManpowerHiringRequest;
  jobSeekerProfile?: JobSeekerProfile;
  actionLogs: ServiceActionLog[];
}

// API Response Types
export interface ServiceRequestsResponse {
  data: ServiceRequest[];
  message: string;
}

export interface ServiceRequestResponse {
  data: ServiceRequest;
  message: string;
}

// Update types for admin operations
export interface UpdateServiceStatusRequest {
  status: ServiceStatus;
}

export interface AssignServiceRequest {
  adminId: string;
}

export interface ServiceStatsResponse {
  totalServices: number;
  pendingServices: number;
  inReviewServices: number;
  completedServices: number;
  servicesByType: Record<ServiceType, number>;
  servicesByStatus: Record<ServiceStatus, number>;
}
