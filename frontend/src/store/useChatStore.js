/**
 * Zustand store for chat-related functionalities.
 *
 * @property {Array} messages - Stores the messages for the selected user.
 * @property {Array} users - Stores the list of users.
 * @property {Object|null} selectedUser - Stores the currently selected user.
 * @property {boolean} isUsersLoading - Indicates if the users are being fetched.
 * @property {boolean} isMessagesLoading - Indicates if the messages are being fetched.
 *
 * @method getUsers - Fetches the list of users and updates the store.
 * @method getMessages - Fetches the messages for a specific user and updates the store.
 * @method sendMessage - Sends a message to the selected user and updates the store.
 * @method setSelectedUser - Sets the selected user in the store.
 *
 * Notes:
 * - messages: Whenever someone clicks on a user, we will fetch the messages and store them in the messages variable which is in the Zustand store.
 * - users: Whenever we fetch the users, we will store them in the users variable.
 * - selectedUser: Whenever we click on a user, we will store that user in the selectedUser variable.
 * - isUsersLoading: Whenever we are fetching the users, we will set this to true and when we are done fetching, we will set it to false.
 * - isMessagesLoading: Whenever we are fetching the messages, we will set this to true and when we are done fetching, we will set it to false.
 */
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error in getUsers", error);
      toast.error("Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages", error);
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const {selectedUser,messages} = get();
    try{
        const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
        set({messages:[...messages,res.data]});
    }catch(error){
        console.log("Error in sendMessage",error);
        toast.error("Failed to send message");
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket || !socket.connected) return;

    socket.off("newMessage"); // Ensure no duplicate listeners
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // todo : Optimize this later
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
}));



