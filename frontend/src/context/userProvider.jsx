import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // clearUser and updateUser are stable via useCallback
  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    if (!token) {
      if (isMounted) setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        if (isMounted) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        if (isMounted) clearUser();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [clearUser]);

  // Memoize context value to avoid unnecessary rerenders
  const contextValue = useMemo(
    () => ({ user, loading, updateUser, clearUser }),
    [user, loading, updateUser, clearUser]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
