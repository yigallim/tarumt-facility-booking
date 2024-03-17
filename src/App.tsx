import LoginRegisterLayout from "./pages/LoginRegisterLayout";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import RegisterSuccess from "./pages/RegisterSuccess";
import NewBooking from "./pages/main/NewBooking";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import useApp from "./hooks/useApp";
import Layout from "./pages/main/layout/Layout";
import Account from "./pages/main/Account";
import BookingHistory from "./pages/main/BookingHistory";
import { getFacilities } from "./api/facilitites";
import useFacilityState from "./hooks/states/useFacilityState";
import useAccountState from "./hooks/states/useAccountState";
import { getAccounts } from "./api/accounts";
import useBookingState from "./hooks/states/useBookingState";
import { getBookings } from "./api/bookings";

function ToLogin() {
  const { message } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
    message.warning("You haven't logged in, please log in first.");
  }, [navigate]);
  return null;
}

function ToHome() {
  const { message } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/main/newbooking", { replace: true });
    message.info("You've already logged in before.");
  }, [navigate]);
  return null;
}

const App = () => {
  const { setFacilities } = useFacilityState();
  const { setAccounts } = useAccountState();
  const { setBookings } = useBookingState();
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      async function fetchFacility() {
        const { error, data } = await getFacilities();
        if (!error) setFacilities(data);
      }
      async function fetchAccount() {
        const { data, error } = await getAccounts();
        if (!error) setAccounts(data);
      }
      async function fetchBooking() {
        const { data, error } = await getBookings();
        if (!error) setBookings(data);
      }
      fetchFacility();
      fetchAccount();
      fetchBooking();
    }
  }, [user]);

  if (loading) return null;

  if (location.pathname === "/login" && user) {
    return <ToHome />;
  }

  if (location.pathname !== "/login" && !user && location.pathname !== "/success") {
    return <ToLogin />;
  }

  return (
    <Routes>
      <Route path="login" element={<LoginRegisterLayout />} />
      <Route path="success" element={<RegisterSuccess />} />
      {user && (
        <Route path="main" element={<Layout />}>
          <Route path="newbooking" element={<NewBooking />} />
          <Route path="history" element={<BookingHistory />} />
          <Route path="account" element={<Account />} />
          <Route index element={<Navigate to="newbooking" />} />
        </Route>
      )}
      <Route path="*" element={<Navigate to={user ? "/main/newbooking" : "/login"} />} />
    </Routes>
  );
};

export default App;
