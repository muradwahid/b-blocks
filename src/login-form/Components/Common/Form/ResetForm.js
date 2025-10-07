/* eslint-disable no-unused-vars */
import { useState } from "react";

const ResetForm = ({ setFormType, nonce, attributes }) => {
    const [formMessage, setFormMessage] = useState("");
    const [isLoading, setIsLoading] = useState(null);

    const handleResetPass = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const email = e.target.email.value;

        const formData = new FormData();

        formData.append("action", "lgfr_password_reset");
        formData.append("nonce", nonce);
        formData.append("email", email);

        try {
            const res = await fetch(
                `${window.location.origin + wp.ajax.settings.url}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const response = await res.json();
            setFormMessage(response);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
        setTimeout(() => {
            setFormMessage(null);
        }, 5000);
    };

    return (
        <div className="lgfr-reset-password-main-wrapper">
            <div className="lgfr-reset-form">
                <button
                    onClick={() => setFormType("loginform")}
                    className="lgfr-backtoForm"
                >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" >
                        <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 010 .708L3.207 8l2.647 2.646a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 01.708 0z" clipRule="evenodd" ></path>
                        <path fillRule="evenodd" d="M2.5 8a.5.5 0 01.5-.5h10.5a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd" ></path>
                    </svg>
                    <span>Back</span>
                </button>
                <h3 className="lgfr-reset-password-heading">Reset Password</h3>
                <p className="message">
                    Enter your email address and we will send you a link to reset your
                    password.
                </p>
                <div className="lgfr-reset-password-message">
                    {formMessage && (
                        <>
                            {!formMessage?.success && (
                                <p className="error-message">{formMessage?.data?.message}</p>
                            )}
                            {formMessage?.success && (
                                <p className="success-message">{formMessage?.data?.message}</p>
                            )}
                        </>
                    )}
                </div>
                <form onSubmit={handleResetPass} className="lgfr-reset-password-wrapper" >
                    <div className="lgfr-reset-pass-field">
                        <input type="email" name="email" id="email" placeholder="Enter your email address" required />
                    </div>
                    <div className="lgfr-sendmailBtn">
                        <button disabled={isLoading} type="submit">
                            Send email
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetForm;
