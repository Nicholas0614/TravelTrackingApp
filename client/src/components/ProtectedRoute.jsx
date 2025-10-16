import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import NoPermission from "./NoPermission";

export default function ProtectedRoute({ children, requiredRole }) {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser } = cookies || {};
  const [authChecked, setAuthChecked] = useState(false);

  // Wait until cookie is fully loaded
  useEffect(() => {
    setAuthChecked(true);
  }, [currentuser]);

  if (!authChecked) {
    // Still checking auth → don't render anything yet
    return null;
  }

  // Not logged in → redirect to login
  if (!currentuser) {
    return <NoPermission />;
  }

  // Role check → show NoPermission if role is not allowed
  if (requiredRole && currentuser.role !== requiredRole) {
    return <NoPermission />;
  }

  return children;
}
