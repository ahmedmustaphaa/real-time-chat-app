import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UseAppContext } from "../context/ProviderContext";

const Homepage = lazy(() => import("./pages/Homepage"));
const Loginpage = lazy(() => import("./pages/Loginpage"));
const EditProfile = lazy(() => import("./pages/EditProfile"));

export default function App() {
  const { authUser, loading } = UseAppContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        جاري التحقق من تسجيل الدخول...
      </div>
    );
  }

  return (
    <div className="bg-[url('./bgImage.svg')] bg-contain">
      <Toaster />
      <Suspense fallback={<div className="text-white p-6">جارٍ التحميل...</div>}>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <Loginpage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <EditProfile /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}
