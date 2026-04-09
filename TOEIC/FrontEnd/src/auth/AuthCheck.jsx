import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthCheck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        const role = res.data.role;

        if (role === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Checking session...</div>;
  }

  return null;
}

export default AuthCheck;
