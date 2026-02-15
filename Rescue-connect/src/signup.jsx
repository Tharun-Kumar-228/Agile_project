import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    role: "volunteer",
    generalType: "",
    volunteerInfo: {
      vehicleNo: "",
      licenseNo: "",
      whoTheyAre: "",
    },
  });

  const [file, setFile] = useState(null); // document upload
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["vehicleNo", "licenseNo", "whoTheyAre"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        volunteerInfo: { ...prev.volunteerInfo, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === "object") {
          form.append(key, JSON.stringify(formData[key])); // nested objects
        } else {
          form.append(key, formData[key]);
        }
      });
      if (file) {
        form.append("proofDocument", file);
      }

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful ✅");
      } else {
        setMessage(data.message || "Signup failed ❌");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Username</label>
          <input name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Mobile</label>
          <input name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>

        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div>
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="volunteer">Volunteer</option>
            <option value="general">General User</option>
          </select>
        </div>

        {/* General user subtype */}
        {formData.role === "general" && (
          <div>
            <label>General User Type</label>
            <select name="generalType" value={formData.generalType} onChange={handleChange} required>
              <option value="">--Select--</option>
              <option value="ngo">NGO</option>
              <option value="serviceable_group">Serviceable Group</option>
              <option value="hostel">Hostel</option>
              <option value="catering">Catering</option>
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="old_age_home">Old Age Home</option>
              <option value="orphanage_home">Orphanage Home</option>
              <option value="other_home">Other Home</option>
              <option value="others">Others</option>
            </select>
          </div>
        )}

        {/* Volunteer extra fields */}
        {formData.role === "volunteer" && (
          <>
            <div>
              <label>Vehicle Number</label>
              <input name="vehicleNo" value={formData.volunteerInfo.vehicleNo} onChange={handleChange} />
            </div>

            <div>
              <label>License Number</label>
              <input name="licenseNo" value={formData.volunteerInfo.licenseNo} onChange={handleChange} />
            </div>

            <div>
              <label>Who They Are</label>
              <input name="whoTheyAre" value={formData.volunteerInfo.whoTheyAre} onChange={handleChange} />
            </div>
          </>
        )}

        {/* Proof document (for both roles) */}
        <div>
          <label>
            {formData.role === "volunteer" ? "Upload License Document" : "Upload Proof Document"}
          </label>
          <input type="file" name="proofDocument" onChange={handleFileChange} required />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
