import { useState, useEffect } from "react";
import {
  createOrganization,
  updateOrganization,
  approveOrganization,
  rejectOrganization,
  getAllOrganizations
} from "../../api/organizationApi";

const EMPTY_FORM = {
  name: "",
  email: "",
  address: "",
  city: "",
  type: "Manufacturing",
  website: "",
  adminName: "",
  adminEmail: "",
  adminPassword: ""
};

export default function ManageOrganizations({ addToast }) {
  const [orgs, setOrgs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const res = await getAllOrganizations();
      setOrgs(res.data);
    } catch (err) {
      addToast("❌ Failed to load data", "error");
    }
  };

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Organization name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.email.trim()) e.email = "Email is required";

    if (modal === "add") {
      if (!form.adminName.trim()) e.adminName = "Admin name required";
      if (!form.adminEmail.trim()) e.adminEmail = "Admin email required";
      if (!form.adminPassword.trim()) e.adminPassword = "Password required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openEdit = (org) => {
    setEditTarget(org);
    setForm({
      name: org.name || "",
      email: org.email || "",
      address: org.address || "",
      city: org.city || "",
      type: org.type || "Manufacturing",
      website: org.website || "",
      adminName: org.adminName || "",
      adminEmail: org.adminEmail || "",
      adminPassword: ""
    });
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditTarget(null);
    setErrors({});
  };

  const handleAdd = async () => {
    if (!validate()) return;
    await createOrganization(form);
    addToast("✅ Organization + Admin created", "success");
    fetchOrgs();
    closeModal();
  };

  const handleEdit = async () => {
    if (!validate()) return;
    await updateOrganization(editTarget.id, form);
    addToast("✏️ Updated successfully", "success");
    fetchOrgs();
    closeModal();
  };

  const handleApprove = async (id) => {
    await approveOrganization(id);
    fetchOrgs();
  };

  const handleReject = async (id) => {
    await rejectOrganization(id);
    fetchOrgs();
  };

  const filtered = orgs.filter((o) => {
    const matchSearch =
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.city?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || o.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="page">

      <div className="cv-card">
        <div className="card-head">
          <span className="card-head-title">
             Organizations ({orgs.length})
          </span>

          <input
            className="f-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="f-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button className="cv-btn btn-primary sm" onClick={openAdd}>
            + Add Organization
          </button>
        </div>

        {/* TABLE */}
        <table className="cv-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Organization</th>
              <th>Type</th>
              <th>City</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              filtered.map((org, i) => (
                <tr key={org.id}>
                  <td>{i + 1}</td>
                  <td>{org.name}</td>
                  <td>{org.type}</td>
                  <td>{org.city}</td>
                  <td>{org.email}</td>

                  <td>
                    <span className={`cv-badge ${org.status === "APPROVED" ? "b-active" : org.status === "REJECTED" ? "b-alrt" : "b-pending"}`}>
                      {org.status}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="cv-btn btn-success sm" onClick={() => handleApprove(org.id)}>Approve</button>
                      <button className="cv-btn btn-danger sm" onClick={() => handleReject(org.id)}>Reject</button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <div className="modal-head">
              <span style={{ fontWeight: 700 }}>
                {modal === "add" ? "Add Organization" : "Edit Organization"}
              </span>
            </div>

            <div className="modal-body">

              <label className="f-label">Organization Name</label>
              <input className="f-control" value={form.name}
                onChange={(e) => setField("name", e.target.value)} />
              {errors.name && <p className="f-error">{errors.name}</p>}

              <label className="f-label">City</label>
              <input className="f-control" value={form.city}
                onChange={(e) => setField("city", e.target.value)} />
              {errors.city && <p className="f-error">{errors.city}</p>}

              <label className="f-label">Email</label>
              <input className="f-control" value={form.email}
                onChange={(e) => setField("email", e.target.value)} />
              {errors.email && <p className="f-error">{errors.email}</p>}

              <label className="f-label">Address</label>
              <input className="f-control" value={form.address}
                onChange={(e) => setField("address", e.target.value)} />

              <label className="f-label">Website</label>
              <input className="f-control" value={form.website}
                onChange={(e) => setField("website", e.target.value)} />

              <hr />

              <h4>Admin Details</h4>

              <label className="f-label">Admin Name</label>
              <input className="f-control" value={form.adminName}
                onChange={(e) => setField("adminName", e.target.value)} />

              <label className="f-label">Admin Email</label>
              <input className="f-control" value={form.adminEmail}
                onChange={(e) => setField("adminEmail", e.target.value)} />

              <label className="f-label">Password</label>
              <input type="password" className="f-control"
                value={form.adminPassword}
                onChange={(e) => setField("adminPassword", e.target.value)} />

            </div>

            <div className="modal-foot">
              <button className="cv-btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button
                className="cv-btn btn-primary"
                onClick={modal === "add" ? handleAdd : handleEdit}
              >
                {modal === "add" ? "Add" : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}