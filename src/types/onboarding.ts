// src/types/auth.ts
export interface VerifyEmailRequest {
  email: string;
//   code: string;
}

export interface VerifyEmailResponse {
  message: string;
  email: string;
  isSuccess: boolean;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  isSuccess: boolean;
  message: string;
  title: string;
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
            expires_at: Number
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
    config_id: number;
    survey_title: string;
    survey_description: string;
    is_required: boolean;
    question: {
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
  // azerid: string;
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