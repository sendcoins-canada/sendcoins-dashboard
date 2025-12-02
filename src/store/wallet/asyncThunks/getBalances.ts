import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllBalances, getBNBBalance, getBTCBalance, getETHBalance, getUSDCBalance, getUSDTBalance } from "@/api/wallet";

export const getBTCBalanceThunk = createAsyncThunk(
  "wallet/getBTCBalance",
  async (data: { token: string; network: string }, { rejectWithValue }) => {
    try {
      const res = await getBTCBalance(data);
      // <-- ADD LOG HERE TO SEE API RESPONSE
      console.log('getBTCBalanceThunk Fulfilled Response:', res.data || res);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "BTC balance failed");
    }
  }
);

export const getETHBalanceThunk = createAsyncThunk(
  "wallet/getETHBalance",
  async (data: { token: string; network: string }, { rejectWithValue }) => {
    try {
      const res = await getETHBalance(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "ETH balance failed");
    }
  }
);

export const getBNBBalanceThunk = createAsyncThunk(
  "wallet/getBNBBalance",
  async (data: { token: string; network: string }, { rejectWithValue }) => {
    try {
      const res = await getBNBBalance(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "BNB balance failed");
    }
  }
);

export const getUSDTBalanceThunk = createAsyncThunk(
  "wallet/getUSDTBalance",
  async (data: { token: string; network: string }, { rejectWithValue }) => {
    try {
      const res = await getUSDTBalance(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "USDT balance failed");
    }
  }
);

export const getUSDCBalanceThunk = createAsyncThunk(
  "wallet/getUSDCBalance",
  async (data: { token: string; network: string }, { rejectWithValue }) => {
    try {
      const res = await getUSDCBalance(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "USDC balance failed");
    }
  }
);

export const getAllBalanceThunk = createAsyncThunk(
  "wallet/getAllBalances",
  async (data: { token: string }, { rejectWithValue }) => {
    try {
      const res = await getAllBalances(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Get all balance failed");
    }
  }
);
