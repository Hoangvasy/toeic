import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      axios
        .get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        })
        .then((res) => {
          const role = res.data.role;

          if (role === "ADMIN") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        })
        .catch(() => {
          navigate("/login");
        });
    };

    checkSession();

    window.addEventListener("focus", checkSession);

    return () => {
      window.removeEventListener("focus", checkSession);
    };
  }, []);

  return <div>Checking session...</div>;
}

export default AuthCheck;
