
import { useEffect, useState } from "react";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

function OwnerManagement() {
  const { token, user } = useAuth();

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showUpdatePassword, setShowUpdatePassword] =
    useState(false);

  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [account, setAccount] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  // ===============================
  // GET OWNERS
  // ===============================
  const fetchOwners = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/owners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOwners(response.data.owners || []);
    } catch (error) {
      console.error("Get Owners Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load owners."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOwners();
    }
  }, [token]);

  // ===============================
  // CREATE OWNER
  // ===============================
  const handleCreateOwner = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !newOwner.name ||
      !newOwner.email ||
      !newOwner.password
    ) {
      setMessage("Please fill all owner fields.");
      setMessageType("error");
      return;
    }

    if (newOwner.password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      setMessageType("error");
      return;
    }

    try {
      setCreating(true);

      const response = await axios.post(
        `${API_URL}/register`,
        newOwner,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Owner created successfully."
      );
      setMessageType("success");

      setNewOwner({
        name: "",
        email: "",
        password: "",
      });

      fetchOwners();
    } catch (error) {
      console.error("Create Owner Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create owner."
      );

      setMessageType("error");
    } finally {
      setCreating(false);
    }
  };

  // ===============================
  // UPDATE MY ACCOUNT
  // ===============================
  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!account.name.trim()) {
      setMessage("Name cannot be empty.");
      setMessageType("error");
      return;
    }

    if (!account.email.trim()) {
      setMessage("Owner ID/email cannot be empty.");
      setMessageType("error");
      return;
    }

    if (
      account.newPassword &&
      !account.currentPassword
    ) {
      setMessage(
        "Enter your current password to change password."
      );
      setMessageType("error");
      return;
    }

    if (
      account.newPassword &&
      account.newPassword.length < 6
    ) {
      setMessage(
        "New password must be at least 6 characters."
      );
      setMessageType("error");
      return;
    }

    try {
      setUpdating(true);

      const response = await axios.put(
        `${API_URL}/my-account`,
        {
          name: account.name,
          email: account.email,
          currentPassword: account.currentPassword,
          newPassword: account.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Account updated successfully."
      );
      setMessageType("success");

      setAccount({
        name: response.data.user.name,
        email: response.data.user.email,
        currentPassword: "",
        newPassword: "",
      });

      fetchOwners();
    } catch (error) {
      console.error(
        "Update Account Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to update account."
      );

      setMessageType("error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Owner Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage owner accounts and your account
            credentials.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Create Owner */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
              <UserPlus size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Create New Owner
              </h2>

              <p className="text-sm text-gray-500">
                Add another owner who can access the
                admin panel.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateOwner}
            className="mt-6 grid gap-5 md:grid-cols-3"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Owner Name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={newOwner.name}
                  onChange={(e) =>
                    setNewOwner({
                      ...newOwner,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter owner name"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Owner ID / Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={newOwner.email}
                  onChange={(e) =>
                    setNewOwner({
                      ...newOwner,
                      email: e.target.value,
                    })
                  }
                  placeholder="owner@example.com"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newOwner.password}
                  onChange={(e) =>
                    setNewOwner({
                      ...newOwner,
                      password: e.target.value,
                    })
                  }
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-10 text-sm outline-none focus:border-black"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Create Owner
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Owners */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Existing Owners
              </h2>

              <p className="text-sm text-gray-500">
                Owners who currently have admin access.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOwners}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            {loading ? (
              <p className="py-6 text-center text-sm text-gray-500">
                Loading owners...
              </p>
            ) : owners.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">
                No owners found.
              </p>
            ) : (
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-3 py-3 font-semibold">
                      Name
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Owner ID
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {owners.map((owner) => (
                    <tr
                      key={owner._id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                            <User
                              size={16}
                              className="text-gray-500"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {owner.name}
                            </p>

                            {owner._id === user?.id && (
                              <span className="text-xs text-gray-400">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-sm text-gray-600">
                        {owner.email}
                      </td>

                      <td className="px-3 py-4 text-sm text-gray-500">
                        {new Date(
                          owner.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* My Account */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              My Account
            </h2>

            <p className="text-sm text-gray-500">
              Change your owner ID, name, or password.
            </p>
          </div>

          <form
            onSubmit={handleUpdateAccount}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={account.name}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Owner ID / Email
              </label>

              <input
                type="email"
                value={account.email}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={account.currentPassword}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      currentPassword:
                        e.target.value,
                    })
                  }
                  placeholder="Required to change password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 pr-10 text-sm outline-none focus:border-black"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={
                    showUpdatePassword
                      ? "text"
                      : "password"
                  }
                  value={account.newPassword}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Leave empty to keep current password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 pr-10 text-sm outline-none focus:border-black"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowUpdatePassword(
                      !showUpdatePassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showUpdatePassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Update Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  "Update My Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OwnerManagement;
