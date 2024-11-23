import axios from "axios";
import Cookies from "js-cookie";
import { API } from "../Api";

var EncodedMobile = btoa(JSON.stringify(Cookies.get("mobile")));
var mobile = Cookies.get("mobile");
var bearerToken = Cookies.get("token");

export const DecodeString = async (str) => {
  const decodedurl = atob(str);
  return JSON.parse(decodedurl);
};

export const EncodeString = async (str) => {
  const encodedurl = btoa(JSON.stringify(str));
  return encodedurl;
};

export const GetGameTypes = async () => {
  try {
    const postData = {
      data: EncodedMobile,
    };
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };
    const response = await axios.post(
      `${API.colorGameUrl}user/get-game-type`,
      postData,
      axiosConfig
    );
    const decodedData = await DecodeString(response?.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameNumbers = async (id) => {
  try {
    const data = await EncodeString({ mobile, id });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}user/get-game-mapping-number`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameColors = async (id) => {
  try {
    const data = await EncodeString({ mobile, id });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}user/get-game-mapping-color`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameCurrentData = async (id) => {
  try {
    const data = await EncodeString({ mobile, id });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}user/get-record-not-complete`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameAllResult = async (id) => {
  try {
    let page = 1;
    const data = await EncodeString({ mobile, id, page });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}user/get-record-complete`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const MyColorGameHistory = async (id, page) => {
  try {
    const data = await EncodeString({ mobile, id, page });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}user/get-bet-record`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const AddNewColorGameBet = async (formData) => {
  const select = formData.select;
  const color = formData.color;
  const period = formData.period;
  const method = formData.method;
  const game_type = formData.game_type;
  const id = formData.id;
  const total_amount = formData.total_amount;
  const bonuscheck = false;
  try {
    const data = await EncodeString({
      select,
      color,
      period,
      method,
      game_type,
      id,
      total_amount,
      mobile,
      bonuscheck,
    });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}user/add-bet-details`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const MainGameWalletMoneyTransfer = async (formData, pin) => {
  try {
    const postData = {
      mobile: mobile,
      pin: pin,
      amount: formData.amount,
      type: formData.type,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}user/color-money-transfer`,
      postData,
      axiosConfig
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const MinesGameUpdateWallet = async (formData) => {
  try {
    const postData = {
      mobile: mobile,
      amount: formData.amount,
      type: formData.type,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}user/add-balance-update`,
      postData,
      axiosConfig
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
