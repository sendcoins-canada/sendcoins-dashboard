import { createAsyncThunk } from "@reduxjs/toolkit";
// Assuming you have an API function: getTransactionDetail(data: {token: string; keychain: string})
import { getTransactionDetail } from "@/api/transactions"; 

interface DetailFetchData {
    token: string;
    //  Update this name to keychain to match the API's expectation, 
    // or map it if you prefer transactionId in the component level.
    txId: string; 
}

export const getTransactionDetailThunk = createAsyncThunk(
    "transaction/getDetail",
    async (data: DetailFetchData, { rejectWithValue }) => {
        try {
            //  FIX: Pass the entire 'data' object as the single argument
            const res = await getTransactionDetail(data); 
            
            // The response structure is { data: {...} }
            const detailData = res.data?.data || res.data;
            
            return detailData;
        } catch (err: any) {
            console.error('getTransactionDetailThunk Rejected Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data || "Failed to fetch transaction details");
        }
    }
);