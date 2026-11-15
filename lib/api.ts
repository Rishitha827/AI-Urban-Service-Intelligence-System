const API_BASE_URL =  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the backend. Check whether the Flask server is running."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data as T;
}

// Complaint registration
export interface ComplaintRegistration {
  complaint_text: string;
  ward: string;
  duration_days?: number;
}

export interface RegistrationResponse {
  message: string;
  registration_type: string;
  complaint_id: string;
  issue_group_id: string;
  tracking_token: string;
  predicted_urgency: string;
  category: string;
  priority_score: number;
  similar_complaint: boolean;
  similarity_score: number | null;
  matched_complaint: Record<string, unknown> | null;
  total_reports_in_issue_group: number;
}

export function registerComplaint(data: ComplaintRegistration) {
  return apiRequest<RegistrationResponse>("/api/complaints", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Complaint tracking
export interface TrackingRequest {
  complaint_id: string;
  tracking_token: string;
}

export interface TrackingResponse {
  complaint: {
    complaint_id: string;
    issue_group_id: string;
    complaint_text: string;
    ward: string;
    category: string;
    predicted_urgency: string;
    priority_score: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  status_history: {
    old_status: string | null;
    new_status: string;
    changed_at: string;
  }[];
}

export function trackComplaint(data: TrackingRequest) {
  return apiRequest<TrackingResponse>("/api/complaints/track", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// City dashboard
export function getDashboard() {
  return apiRequest<{
    total_complaints: number;
    resolved: number;
    pending: number;
    in_progress: number;
    recurring_issue_groups: number;
    category_breakdown: { category: string; count: number }[];
    top_wards: { ward: string; count: number }[];
    priority_issues: {
      issue_group_id: string;
      complaint_count: number;
      priority_score: number;
      urgency: string;
      latest_activity: string;
    }[];
  }>("/api/dashboard");
}

// All wards
export function getAreas() {
  return apiRequest<{
    total_areas: number;
    areas: AreaStatistics[];
  }>("/api/areas");
}

// Area intelligence
export interface AreaStatistics {
  ward: string;
  total_complaints: number;
  recent_30_days: number;
  previous_30_days: number;
  complaint_trend: string;
  unresolved_complaints: number;
  recurring_issue_groups: number;
  average_urgency_score: number;
  risk_score: number;
  risk_zone: string;
  category_breakdown: { category: string; count: number }[];
}

export function getAreaIntelligence(ward: string) {
  return apiRequest<{
    comparison_count: number;
    areas: AreaStatistics[];
  }>(`/api/area-intelligence?ward=${encodeURIComponent(ward)}`);
}

export function compareAreas(wards: string[]) {
  const query = wards.map(encodeURIComponent).join(",");
  return apiRequest<{
    comparison_count: number;
    areas: AreaStatistics[];
  }>(`/api/area-intelligence?wards=${query}`);
}
