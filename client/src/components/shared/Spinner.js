import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Spinner = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate("/login", {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, location.pathname, navigate]);
  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <h1 className="Text-center">
        Redirecting to login in {count} seconds...
      </h1>

      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
