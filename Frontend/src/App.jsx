import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/Dashboard/DashboardPage"
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";
import FlashcardsListPage from "./pages/Flashcards/FlashcardsListPage";
import FlashcardPage from "./pages/Flashcards/FlashcardPage";
import QuizTakePage from "./pages/Quizzes/QuizTakePage";
import QuizResultPage from "./pages/Quizzes/QuizResultPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  if(loading){
   return(
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
   )
  }
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace/> :<Navigate to="/login" replace/>}/>
        <Route path="/login" element={<LoginPage />}  />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes*/}
        <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<DashboardPage/>} />
         <Route path="/documents" element={<DocumentListPage/>} />
          <Route path="/documents/:id" element={<DocumentDetailPage/>} />
           <Route path="/flashcards" element={<FlashcardsListPage/>} />
           <Route path="/documents/:id/flashcards" element={<FlashcardPage/>} />
         <Route path="/quizzes/:quizId" element={<QuizTakePage/>} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage/>} />
           <Route path="/profile" element={<ProfilePage/>} />
        </Route>


        <Route path="*" element={<NotFoundPage/>} />
     
        
        {/* Dashboard with nested routes */}
        {/* <Route path="/dashboard" element={<DashBoard />}>
        <Route path="admin" element={<Admin />} />
        <Route path="progress" element={<UserProgress />} />
        <Route path="users" element={<Users />} />
        </Route> */}
      </Routes>
    </Router>
   
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
