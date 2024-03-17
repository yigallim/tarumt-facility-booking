import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";
import useApp from "./useApp";
import useAccountState from "./states/useAccountState";

const useSignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { notification } = useApp();

  const { setAccounts } = useAccountState();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      notification.error({
        message: "Log Out Unsuccessful",
        description: "Unexpected error occurred, please try again.",
      });
    } else {
      logout();
      navigate("/login", { replace: true });
    }
    setAccounts([]);
  };

  return signOut;
};

export default useSignOut;
