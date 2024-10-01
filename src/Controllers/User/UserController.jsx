import axios from "axios";
import Cookies from "js-cookie";
import { API } from "../Api";

var mobile = Cookies.get("mobile");
var bearerToken = Cookies.get("token");

export const GetUserDetails = async () => {
  try {
    const postData = {
      mobile: mobile,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}user/user-details`,
      postData,
      axiosConfig
    );

    if (response.data.status) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const ChangePasswordControll = async (formData) => {
  try {
    const postData = {
      mobile: mobile,
      password: formData.password,
      new_password: formData.new_password,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}user/change-password`,
      postData,
      axiosConfig
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DepositRequest = async (formData) => {
  const formDataToSend = new FormData();
  formDataToSend.append("transection_id", formData.utr);
  formDataToSend.append("mobile", mobile);
  formDataToSend.append("image", formData.image);
  formDataToSend.append("amount", formData.amount);
  formDataToSend.append("deposit_id", formData.deposit_id);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/deposit-request`,
      formDataToSend,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetPaymentMethod = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-pay-method`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const CreateAccountPin = async (pin) => {
  const postData = {
    mobile: mobile,
    pin: pin,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/create-pin`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const GetUserPaymentHistory = async () => {
  try {
    const postData = {
      mobile: mobile,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };
    const response = await axios.post(
      `${API.url}user/get-deposit-request`,
      postData,
      axiosConfig
    );
    if (response?.data?.status) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const GetInvestmentPlans = async () => {
  try {
    const response = await axios.post(`${API.url}user/get-plans`);
    if (response.data.status) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const MakeNewInvestment = async (formData) => {
  const postData = {
    mobile: mobile,
    pin: formData.pin,
    amount: formData.amount,
    plan: formData.investmentPlan,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/make-new-investment`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const MyInvestMentHistory = async (formData) => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-investment-plan`,
      postData,
      axiosConfig
    );
    if (response.data.status) {
      return response.data.data.reverse();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const UpdateUserDetails = async (formData) => {
  const postData = {
    mobile: mobile,
    bank_name: formData.bank_name,
    ifsc_code: formData.ifsc_code,
    ac_no: formData.ac_no,
    ac_name: formData.ac_name,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/update-user-details`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddWithdrawalRequest = async (pin, amount) => {
  const postData = {
    mobile: mobile,
    amount: amount,
    pin: pin,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/add-withdrawal-request`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddCryptoWithdrawalRequest = async (formData, pin) => {
  const postData = {
    mobile: mobile,
    amount: formData.amount,
    pin: pin,
    address: formData.address,
    price_at_time: formData.price_at_time,
    currency: formData.currency,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/add-usdt-withdrawal-request`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddCryptoDepositRequest = async (formData) => {
  const postData = new FormData();

  postData.append("amount", formData.amount);
  postData.append("transection_id", formData.transection_id);
  postData.append("image", formData.image);
  postData.append("deposit_id", formData.deposit_id);
  postData.append("price_at_time", formData.price_at_that_time);
  postData.append("mobile", mobile);
  postData.append("currency", formData.currency);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/deposit-usdt-request`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAccountAllStatement = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-statement`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
