import { useState } from "react";
import AuthService from "../services/AuthService";
import styles from "./ChangePassword.module.css";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New and old passwords do not match.");
      return;
    }

    try {
      await AuthService.changePassword(
        formData.oldPassword,
        formData.newPassword
      );
      setSuccessMessage("Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to change password.");
    }
  };

  return (
    <>
      {/* Loading / updating / error modal */}
      {(isLoading || successMessage || errorMessage) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {isLoading ? (
              <>
                <div className={styles.loader}></div>
                <p>Loading note...</p>
              </>
            ) : successMessage ? (
              <>
                <p style={{ color: "green", marginBottom: "1rem" }}>
                  {successMessage}
                </p>
                <button
                  className={styles.closeBtn}
                  onClick={() => setSuccessMessage("")}>
                  Close
                </button>
              </>
            ) : (
              <>
                <p style={{ color: "red", marginBottom: "1rem" }}>
                  {errorMessage}
                </p>
                <button
                  className={styles.closeBtn}
                  onClick={() => setErrorMessage("")}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className={styles.container}>
        <h2 className={styles.heading}>Change Password</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.changeButton}`}
              type="submit">
              Change Password
            </button>
            <button type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={() => {
                setIsLoading(false);
                setErrorMessage("");
                setSuccessMessage("");
                navigate("/dashboard");
                }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
