import { useState } from "react";
import AuthService from "../services/AuthService";
import styles from "./AuthForm.module.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const userData = { name, username, email, password };
      await AuthService.register(userData);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed!");
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name:</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Username:</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password:</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.loginButton}`}
              type="submit">
              Register
            </button>
            <button
              className={`${styles.button} ${styles.registerButton}`}
              onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* Loading / Error Modal */}
      {(isLoading || errorMessage) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isLoading ? (
              <>
                <div className={styles.loader}></div>
                <p>Registering...</p>
              </>
            ) : (
              <>
                <p style={{ color: "red", marginBottom: "1rem" }}>
                  {errorMessage}
                </p>
                <button
                  className={`${styles.button} ${styles.modalButton}`}
                  onClick={() => setErrorMessage("")}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
