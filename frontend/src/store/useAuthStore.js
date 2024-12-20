import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () =>{
    try{
      const res = await axiosInstance.get("/auth/check");
      set({authUser: res.data});
    }catch(error){
      console.log("Error in CheckAuth" , error);
      toast.error("Failed to check authentication status");
    }finally{
      set({isCheckingAuth: false});
    }
  },
  signup: async (data) =>{
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      set({authUser: res.data});
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({isSigningUp: false});
    }
  }
}));