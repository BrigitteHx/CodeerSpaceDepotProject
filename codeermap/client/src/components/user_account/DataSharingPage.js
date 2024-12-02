import React, { useState } from "react";
import "./style/DataSharingPage.css";

const DataSharingPage = () => {
    const [shareUsage, setShareUsage] = useState(false);
    const [allowThirdParty, setAllowThirdParty] = useState(false);
    const [authorizedEmails, setAuthorizedEmails] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [permissions, setPermissions] = useState("read-only");
    const [expirationDate, setExpirationDate] = useState("");

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === "shareUsage") {
            setShareUsage(checked);
        } else if (name === "allowThirdParty") {
            setAllowThirdParty(checked);
        }
    };

    const handleAddEmail = () => {
        if (newEmail && !authorizedEmails.some((entry) => entry.email === newEmail)) {
            setAuthorizedEmails([
                ...authorizedEmails,
                { email: newEmail, permissions, expirationDate },
            ]);
            setNewEmail("");
            setPermissions("read-only");
            setExpirationDate("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Data Sharing Settings Submitted:", {
            shareUsage,
            allowThirdParty,
            authorizedEmails,
        });
    };

    return (
        <div className="data-sharing-page">
            <div className="data-sharing-container">
                <div className="info-header">
                    <h1>Data Sharing Preferences</h1>
                    <p>
                        Manage your data-sharing options below. Decide whether to share
                        your usage statistics, allow third-party access, or grant specific
                        people access to your data.
                    </p>
                </div>
            </div>

            <div className="data-sharing-container">
                <form onSubmit={handleSubmit} className="form">
                    <div className="data-sharing-form-group">
                        <h3>General Data Sharing Options</h3>
                        <label className="custom-switch">
                            <input
                                type="checkbox"
                                name="shareUsage"
                                checked={shareUsage}
                                onChange={handleCheckboxChange}
                                className="custom-switch-input"
                            />
                            <span className="custom-switch-slider"></span>
                            <span className="custom-switch-label">Share usage statistics</span>
                        </label>
                        <label className="custom-switch">
                            <input
                                type="checkbox"
                                name="allowThirdParty"
                                checked={allowThirdParty}
                                onChange={handleCheckboxChange}
                                className="custom-switch-input"
                            />
                            <span className="custom-switch-slider"></span>
                            <span className="custom-switch-label">Allow third-party access</span>
                        </label>
                    </div>

                    <div className="data-sharing-form-group">
                        <h3>Grant Access to Others</h3>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="email-input"
                        />
                        <select
                            value={permissions}
                            onChange={(e) => setPermissions(e.target.value)}
                            className="permission-select"
                        >
                            <option value="read-only">Read-only</option>
                            <option value="edit">Edit</option>
                            <option value="full-access">Full Access</option>
                        </select>
                        <div className="date-container">
                            <input
                                type="date"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="date-input"
                            />
                            <p className="date-description">
                                Set an optional expiration date for this access. If left blank, access will be indefinite.
                            </p>
                        </div>
                        <button type="button" onClick={handleAddEmail} className="btn-add">
                            Add Email
                        </button>
                    </div>

                    <div className="email-list">
                        {authorizedEmails.map((entry, index) => (
                            <div key={index} className="email-entry">
                                <p>
                                    <strong>{entry.email}</strong> - {entry.permissions} 
                                    (Expires:{" "}
                                    {entry.expirationDate ? entry.expirationDate : "No expiration"})
                                </p>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DataSharingPage;
