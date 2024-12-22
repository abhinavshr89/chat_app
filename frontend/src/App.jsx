import Navbar from "./components/Navbar"
import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import { useAuthStore } from "./store/useAuthStore.js"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { useThemeStore } from "./store/useThemeStore.js"


const App = () => {
  const{authUser , checkAuth ,isCheckingAuth,onlineUsers}=useAuthStore();
  const{theme} = useThemeStore();

  console.log(onlineUsers);
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return( 
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-dots loading-lg"></span>
    </div>
    )
  }
  return (
    <div data-theme={theme} >
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUpPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App