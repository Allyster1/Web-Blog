import { useContext } from "react";
import { AuthContext } from "../contexts/authContextValue";

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
