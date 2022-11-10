import axios from "axios";

const Flutterwave = require("flutterwave-node-v3");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

const BASE_API_URL = "https://api.flutterwave.com/v3";

const bankUrl = `${BASE_API_URL}/banks/NG`;

const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
  },
};

export const getAllBanksNG = async () => {
  const response = await axios.get(bankUrl, options);
  return response.data;
};

export async function withdraw(details: any) {
  const response = await flw.Transfer.initiate(details);
  return response;
}

export const withdrawalStatus = async ({ id: payload }: any) => {
  const status = await flw.Transfer.get_a_transfer({ id: payload });
  return status;
};

export const validateBvn = async (payload: { [key: string]: string }) => {
  const response = await flw.Misc.bvn(payload);
  return response;
};
export const validateAccountDetails = async (payload: {
  [key: string]: string;
}) => {
  const response = await flw.Misc.verify_Account(payload);
  return response;
};
