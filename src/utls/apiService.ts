// apiService.ts
import apiClient, {ApiResponse} from './api';

// Define response types
interface LoginResponse {
  status: string;
  message: string;
  user_id: number;
  username: string;
  user_type: string
}

interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  // etc
}

interface RegisterRersponse {
  status: string;
  message: string;
  data : {
    id: number
    name: string,
  }
}

interface CommonResponse {
  status: "success" | string;
  message: string;
  data : any
}

export interface VehicleType {
  id: number;
  category_name: string;
  type: string;
  car_seat_available: number;
  max_passenger_count: number;
  max_luggages: number;
  max_hand_luggages: number;
  file_path: string;
  description: string;
}

export interface VehicleTypeResponse {
  status: "success" | string;
  data : VehicleType []
}

const ApiService = {
  login: (formData: FormData): Promise<ApiResponse<LoginResponse>> =>
    apiClient.postForm('/user/login?username', formData),

  register: (formData: FormData): Promise<ApiResponse<RegisterRersponse>> =>
    apiClient.postForm('/user/register', formData),

  verifyOtp: (formData: FormData): Promise<ApiResponse<CommonResponse>> =>
    apiClient.postForm('/user/verify-otp', formData),

  registerDriver: (formData: FormData): Promise<ApiResponse<CommonResponse>> =>
    apiClient.postForm('/user/register-driver', formData),

  getVehicleTypes: (): Promise<ApiResponse<VehicleTypeResponse>> =>
    apiClient.get('/vehicle/get-vehicle-types'),

  addVehicle: (formData: FormData): Promise<ApiResponse<CommonResponse>> =>
    apiClient.postForm('/vehicle/add-vehicle', formData),

  getActiveRides: (driverId: number): Promise<ApiResponse<CommonResponse>> =>
    apiClient.get(`driver/get-driver-trips?driver_id=19`),

  getProfile: (): Promise<ApiResponse<ProfileResponse>> =>
    apiClient.get('/user/profile'),

  updateProfile: (formData: FormData): Promise<ApiResponse<ProfileResponse>> =>
    apiClient.postForm('/user/update', formData),

  // Add more endpoints here with appropriate types
};

export default ApiService;
