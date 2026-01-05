import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const useVerified = () => {
  const { user } = useContext(AuthContext);

  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (!user?.uid) {
        setIsVerified(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/users/${user.uid}`);

        setIsVerified(Boolean(res.data.users?.isVerified));
      } catch (err) {
        console.error("Failed to fetch verification status", err);
        setError(err);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [user?.uid]);

  return { isVerified, loading, error };
};

export default useVerified;
