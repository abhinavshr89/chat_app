import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    
    getUsers:async()=>{
        set({isUsersLoading:true})
        try{
            const res = await axiosInstance.get("/message/users");
            set({users:res.data})
        }catch(error){
            console.log("Error in getUsers",error);
            toast.error("Failed to fetch users")
        }finally{
            set({isUsersLoading:false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try{
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages:res.data})
        }catch(error){
            console.log("Error in getMessages",error);
            toast.error("Failed to fetch messages")
        }finally{
            set({isMessagesLoading:false})
        }
    },
    // todo : Optimize this later 
    setSelectedUser:(user)=>{
        set({selectedUser:user})
    }
}))