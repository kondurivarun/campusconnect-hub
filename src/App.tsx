import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CollegeDetail from "./pages/CollegeDetail";
import Admin from "./pages/Admin";
import AddEditCollege from "./pages/AddEditCollege";
import Feedback from "./pages/Feedback";
import FeedbackList from "./pages/FeedbackList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/add-college" element={<AddEditCollege />} />
          <Route path="/admin/edit-college/:id" element={<AddEditCollege />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin/feedback" element={<FeedbackList />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
