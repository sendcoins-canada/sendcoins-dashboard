// src/types/auth.ts
export interface VerifyEmailRequest {
  email: string;
  purpose: "login" | "registration" ;
}

export interface VerifyEmailResponse {
  message: string;
  email: string;
  isSuccess: boolean;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  purpose: "login" | "registration" ;
}

// export interface VerifyOtpResponse {
//   isSuccess: boolean;
//   message: string;
//   title: string;
// }
export interface VerifyOtpResponse {
  data: {
  title: string;
  token: {
    azer_token: string;
    expires_at: number;
  };
  result: Array<{
    oauth_id: number;
    useremail: string;
    device?: string;
    // [key: string]: any;
  }>;
  message: string;
  isSuccess: boolean;
  icon?: string;
  redirectUrl?: string;
}
}


export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  country: string;
  code: string;
}

export interface RegisterResponse { 
    data: {
        title: string,
        message: string,
        token: {
            azer_token: string,
            expires_at: number
        },
        isSuccess: boolean,
        icon: string,
        tokenID: string,
        redirectUrl: string
    }
}


export interface LoginRequest {
  email: string;
  password: string;
}

// export interface LoginWithPasswordResponse {
//   title: string;
//   message: string;
//   isSuccess: boolean;
//   icon: string;
//   verifyOTPString: string;
  
// }

export interface LoginWithPasswordResponse {
  data: {
    title: string;
    message: string;
    isSuccess: boolean;
    icon: string;
    verifyOTPString: string;
  };
}


export interface SurveyResponse {
  data: {
    // Backward compatibility for single survey
    config_id?: number;
    survey_title?: string;
    survey_description?: string;
    is_required?: boolean;
    question?: {
      question_id: number;
      question_text: string;
      question_type: string;
      question_options: string; // JSON string
      is_required: boolean;
    };
  };
}

export interface SubmitSurveyRequest {
  email: string;
  config_id: number;
  question_id: number;
  answer: string;
}

export interface CountryResponse {
      data: [
        {
            currency_name: string,
            currency_init: string,
            country: string,
            image: string,
            currency_sign: string,
            selling_rate: string,
            buying_rate: string,
            flag: string,
            flag_emoji: string
        },
      ]
}

// Forgot Password types
export interface RequestPasswordResetRequest {
  email: string;
  newPassword: string;
  currentPassword?: string; // not used for forgotten flow
  created_for?: string; // default 'password_reset'
}

export interface RequestPasswordResetResponse {
  data: {
    authHash: string;
    emailAccount: string;
    created_for: string;
    title: string;
    message: string;
    isSuccess: boolean;
    icon?: string;
  };
}

export interface VerifyPasswordResetOtpRequest {
  authHash: string;
  otp: string;
}

export interface VerifyPasswordResetOtpResponse {
  data: {
    Oauth_hash: string;
    emailAccount: string;
    created_for: string;
    title: string;
    message: string;
    isSuccess: boolean;
    icon?: string;
  };
}

export interface UpdatePasswordWithOtpRequest {
  authHash: string;
  otp: string;
}

export interface UpdatePasswordWithOtpResponse {
  data: {
    title: string;
    message: string;
    isSuccess: boolean;
    icon?: string;
  };
}