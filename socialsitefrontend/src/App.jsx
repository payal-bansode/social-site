import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import { AlertProvider } from './context/AlertContext';
import ProfilePage from './pages/profile/ProfilePage';

import Layout from './layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/home/Home';
import PrivateRoute from './utils/PrivateRoute';
import ExplorePage from './pages/explore/ExplorePage';

import EditProfile from './pages/profile/components/EditProfile';


import ActivaAccPage from './pages/auth/ActivaAccPage';
import ResetAccountPass from './pages/auth/ResetAccPass';
import ResendActivationAcc from './Pages/Auth/ResendActivationAcc';


function App() {


  return (
    <>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Layout />}>

                  <Route path="/" element={<Home />} />


                  <Route path="/:username" element={<ProfilePage />} />
                  <Route path="/explore" element={<ExplorePage />} />

                  <Route path="/:username/setting/" element={<EditProfile />} />


                  

                </Route>
              </Route>


                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path='reset-account-password/' element={<ResetAccountPass />} />
                  <Route path='reset-account-password/:uid/:token' element={<ResetAccountPass />} />

                  <Route path='resend-activation-link/' element={<ResendActivationAcc />} />
                  <Route path='activate-account/:uid/:token' element={<ActivaAccPage />} />
            </Routes>
          </Router>

        </AuthProvider>

      </AlertProvider>


    </>
  )
}

export default App
