import { Gender } from "@/utils/enums/user.enum";

export interface UploadFileRequest {
  // Define the structure of UploadFileRequest here
  // For example:
  filename: string;
  data: string; // base64 encoded file data
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  user_name: string;
  phone_number?: string;
  birth?: Date;
  gender?: Gender;
  avatar?: UploadFileRequest;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_name: string;
  phone_number?: string;
  birth?: Date;
  gender?: Gender;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}
