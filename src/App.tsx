import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UnitDashboard from './components/UnitDashboard';
import SubUnitDashboard from './components/SubUnitDashboard';
import UnitManagement from './components/UnitManagement';
import UserManagement from './components/UserManagement';
import ClassManagement from './components/ClassManagement';
import CRMBoard from './components/CRMBoard';
import ChatDashboard from './components/chat/ChatDashboard';
import Tasks from './components/Tasks';
import Chat from './components/Chat';
import Home from './components/Home';
import LeadRegistrationPage from './components/LeadRegistrationPage';
import LocationLanding from './components/LocationLanding';
import SubUnitLanding from './components/SubUnitLanding';
import ProgramLanding from './components/ProgramLanding';
import CharacterPage from './components/CharacterPage';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentPortal from './components/student/StudentPortal';
import PrivacyAndCopyright from './components/PrivacyAndCopyright';
import PaymentPage from './components/PaymentPage';
import OnlineContentManagement from './components/OnlineContentManagement';
import BadgeManagement from './components/BadgeManagement';
import LeadChatWrapper from './components/chat/LeadChatWrapper';
import About from './components/About';
import Metodologia from './components/Metodologia';
import KihapEmAcao from './components/KihapEmAcao';
import KihapAcademy from './components/KihapAcademy';
import StoreList from './components/store/StoreList';
import StoreWrapper from './components/store/StoreWrapper';
import StoreManagementWrapper from './components/store/StoreManagementWrapper';
import KihapEventManagement from './components/instructor/KihapEventManagement';
import EventCheckinPage from './components/EventCheckinPage';
import EventCheckin from './components/student/EventCheckin';
import ClassSchedule from './components/ClassSchedule';
import { useAuthStore } from './store/useAuthStore';
import { useStoreStore } from './store/useStoreStore';
import { useDataStore } from './store/useDataStore';
import { Student } from './types';

// Componente wrapper para a rota da loja do aluno
function StudentStoreRoute() {
  const user = useAuthStore(state => state.user);
  const { students } = useDataStore();
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" />;
  }

  const student = students.find((s: Student) => s.id === user.id);
  
  if (!student) {
    return <Navigate to="/login" />;
  }

  return <StoreWrapper student={student} />;
}

function App() {
  const user = useAuthStore(state => state.user);
  const stores = useStoreStore(state => state.stores);
  const isDarkMode = useThemeStore(state => state.isDarkMode);

  // Aplicar classe dark diretamente baseado no estado do tema
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return (
    <Router>
      <div className={`relative min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-200`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/metodologia" element={<Metodologia />} />
          <Route path="/kihap-em-acao" element={<KihapEmAcao />} />
          <Route path="/kihap-academy" element={<KihapAcademy />} />
          <Route path="/cadastro" element={<LeadRegistrationPage />} />
          <Route path="/unidade/:location" element={<LocationLanding />} />
          <Route path="/subunidade/:subunit" element={<SubUnitLanding />} />
          <Route path="/programa/:program" element={<ProgramLanding />} />
          <Route path="/personagem/:characterId" element={<CharacterPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/privacidade-e-direitos" element={<PrivacyAndCopyright />} />
          <Route path="/payment/:token" element={<PaymentPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              user ? (
                <>
                  <Header />
                  <Routes>
                    <Route index element={user.role === 'admin' ? <Dashboard /> : <Navigate to={`/unit/${user.unitId}`} />} />
                    <Route path="unit/:unitId" element={<UnitDashboard />} />
                    <Route path="unit/:unitId/subunit/:subunitId" element={<SubUnitDashboard />} />
                    <Route path="units/manage" element={user.role === 'admin' ? <UnitManagement /> : <Navigate to="/" />} />
                    <Route path="users/manage" element={user.role === 'admin' ? <UserManagement /> : <Navigate to="/" />} />
                    <Route path="classes" element={user.role === 'admin' || user.role === 'instructor' ? <ClassManagement /> : <Navigate to="/" />} />
                    <Route path="schedule" element={user.role === 'admin' || user.role === 'instructor' ? <ClassSchedule /> : <Navigate to="/" />} />
                    <Route path="crm" element={user.role === 'admin' ? <CRMBoard /> : <Navigate to="/" />} />
                    <Route path="messages" element={user.role === 'admin' ? <ChatDashboard /> : <Navigate to="/" />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="admin/*" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                    <Route path="online" element={<OnlineContentManagement />} />
                    <Route path="badges" element={<BadgeManagement />} />
                    <Route path="store" element={user.role === 'admin' || user.role === 'instructor' ? <StoreList stores={stores} /> : <Navigate to="/" />} />
                    <Route path="store/:storeId" element={user.role === 'admin' || user.role === 'instructor' ? <StoreManagementWrapper /> : <Navigate to="/" />} />
                    <Route path="events/manage" element={user.role === 'admin' || user.role === 'instructor' ? <KihapEventManagement /> : <Navigate to="/" />} />
                    <Route path="events/checkins" element={user.role === 'admin' || user.role === 'instructor' ? <EventCheckinPage /> : <Navigate to="/" />} />
                  </Routes>
                  <Chat />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/portal" element={<StudentPortal />} />
          <Route path="/store/:storeId" element={<StudentStoreRoute />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <LeadChatWrapper />
      </div>
    </Router>
  );
}

export default App;
