import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Trading from "@/pages/Trading";
import AI from "@/pages/AI";
import Orders from "@/pages/Orders";
import Tasks from "@/pages/Tasks";

import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="trading" element={<Trading />} />
            <Route path="ai" element={<AI />} />
            <Route path="orders" element={<Orders />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
