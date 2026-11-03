import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { ClientLayout } from "../layouts/ClientLayout.jsx";
import { CommonLayout } from "../layouts/CommonLayout.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import Home from "../pages/client/Home.jsx";
import Login from "../pages/common/Login.jsx";
import NotFound from "../pages/common/NotFound.jsx";
import Register from "../pages/common/Register.jsx";

export function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={<ClientLayout><Home /></ClientLayout>}
        />
        <Route
          path="/dashboard"
          element={<AdminLayout><Dashboard /></AdminLayout>}
        />
        <Route
          path="/login"
          element={<CommonLayout><Login /></CommonLayout>}
        />
        <Route
          path="/register"
          element={<CommonLayout><Register /></CommonLayout>}
        />
        <Route
          path="*"
          element={<CommonLayout><NotFound /></CommonLayout>}
        />
      </Routes>
    </BrowserRouter>
  );
}
