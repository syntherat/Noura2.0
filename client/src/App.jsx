import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreatePlan from './pages/Planner/CreatePlan.jsx';
import ViewPlans from './pages/Planner/ViewPlans.jsx';
import PlanDetail from './pages/Planner/PlanDetail.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import RequireAuth from './RequireAuth/RequireAuth.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/app" element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }>
            <Route index element={<Home />} />
            <Route path="plans" element={<ViewPlans />} />
            <Route path="plans/create" element={<CreatePlan />} />
            <Route path="plans/:id" element={<PlanDetail />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;