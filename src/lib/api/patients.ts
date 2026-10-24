import { apiRequest } from "@/lib/api";
import type { RegistrationStatus } from "@/types/registration-dashboard/registration";

const PATIENTS_ENDPOINT = "/api/patients";

export interface PatientApiRecord {
  id: number;
  patientId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  gender: string;
  religion: string;
  civilStatus: string;
  registeredAt: string;
  updatedAt: string;
  status: string;
}

export interface PatientPayload {
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  gender: string;
  religion: string;
  civilStatus: string;
}

export type UpdatePatientPayload = Partial<PatientPayload> & {
  status?: string;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PatientListResponse extends ApiResponse<PatientApiRecord[]> {
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export const patientsApi = {
  // GET /api/patients?page=1&limit=10
  getAll(
    params: { page?: number; limit?: number } = {},
  ): Promise<PatientListResponse> {
    const query = new URLSearchParams();

    if (params.page !== undefined) {
      query.set("page", String(params.page));
    }

    if (params.limit !== undefined) {
      query.set("limit", String(params.limit));
    }

    const queryString = query.toString();
    const endpoint = queryString
      ? `${PATIENTS_ENDPOINT}?${queryString}`
      : PATIENTS_ENDPOINT;

    return apiRequest<PatientListResponse>(endpoint);
  },

  // GET /api/patients/:id
  getById(id: number): Promise<ApiResponse<PatientApiRecord>> {
    return apiRequest<ApiResponse<PatientApiRecord>>(
      `${PATIENTS_ENDPOINT}/${id}`,
    );
  },

  // POST /api/patients
  create(payload: PatientPayload): Promise<ApiResponse<PatientApiRecord>> {
    return apiRequest<ApiResponse<PatientApiRecord>>(PATIENTS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // PATCH /api/patients/:id
  update(
    id: number,
    payload: UpdatePatientPayload,
  ): Promise<ApiResponse<PatientApiRecord>> {
    return apiRequest<ApiResponse<PatientApiRecord>>(
      `${PATIENTS_ENDPOINT}/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  },

  // DELETE /api/patients/:id
  delete(id: number): Promise<ApiResponse<{ id: number; patientId: string }>> {
    return apiRequest<ApiResponse<{ id: number; patientId: string }>>(
      `${PATIENTS_ENDPOINT}/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  // PATCH /api/patients/:id/status
  updateStatus(
    id: number,
    status: RegistrationStatus,
  ): Promise<ApiResponse<PatientApiRecord>> {
    return apiRequest<ApiResponse<PatientApiRecord>>(
      `${PATIENTS_ENDPOINT}/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );
  },
};
