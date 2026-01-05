import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import {
  Trash2,
  XCircle,
  User,
  Shield,
  Calendar,
  Search,
  Filter,
  UserCheck,
  UserX,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const API = "http://localhost:3000/users";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (uid) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    try {
      await axios.delete(`${API}/${uid}`);
      setUsers(users.filter((user) => user.uid !== uid));
      setSelectedUsers(selectedUsers.filter((id) => id !== uid));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const deleteSelectedUsers = () => {
    if (selectedUsers.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedUsers.length} selected users?`
      )
    )
      return;

    selectedUsers.forEach(async (uid) => {
      try {
        await axios.delete(`${API}/${uid}`);
      } catch (error) {
        console.error(`Failed to delete user ${uid}`, error);
      }
    });

    setUsers(users.filter((user) => !selectedUsers.includes(user.uid)));
    setSelectedUsers([]);
  };

  const toggleUserSelection = (uid) => {
    if (selectedUsers.includes(uid)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== uid));
    } else {
      setSelectedUsers([...selectedUsers, uid]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.uid));
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "bg-primary/10 text-primary border-primary/20",
      cook: "bg-secondary/10 text-secondary border-secondary/20",
      foodie: "bg-accent/10 text-accent border-accent/20",
      employee: "bg-muted text-muted-foreground border-border",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          roleColors[role] || roleColors.employee
        }`}
      >
        <Shield className="w-3 h-3 inline mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && user.isVerified) ||
      (verificationFilter === "not-verified" && !user.isVerified);

    return matchesSearch && matchesRole && matchesVerification;
  });

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.isVerified).length,
    admin: users.filter((u) => u.role === "admin").length,
    cook: users.filter((u) => u.role === "cook").length,
    foodie: users.filter((u) => u.role === "foodie").length,
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Verified</p>
          <p className="text-2xl font-bold mt-1">{stats.verified}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Admins</p>
          <p className="text-2xl font-bold mt-1">{stats.admin}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Cooks</p>
          <p className="text-2xl font-bold mt-1">{stats.cook}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Foodies</p>
          <p className="text-2xl font-bold mt-1">{stats.foodie}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border-border border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-muted border-border border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="cook">Cook</option>
                <option value="foodie">Foodie</option>
              </select>
            </div>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-4 py-2.5 bg-muted border-border border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="not-verified">Not Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="font-medium">
                {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={deleteSelectedUsers}
                className="px-4 py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-card border border-border rounded-xl shadow-sm">
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <UserX className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No users found</p>
                    {searchTerm && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Try a different search term
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.uid}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.uid)}
                      onChange={() => toggleUserSelection(user.uid)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(user.createdAt || user.updatedAt)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        <UserCheck className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                        <XCircle className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => deleteUser(user.uid)}
                        className="p-2 hover:bg-error/10 rounded-lg transition-colors group"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4 text-error group-hover:text-error/80" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>
    </div>
  );
};

export default AllUsers;
