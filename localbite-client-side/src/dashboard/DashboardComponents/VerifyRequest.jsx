import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  ChefHat,
  Calendar,
  MoreVertical,
  AlertCircle,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import Loading from "../../components/Loading";

const VerifyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/verify");
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/verify/${id}/approve`);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const decline = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/verify/${id}/decline`);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (selectedFilter === "all") return true;
    return request.status === selectedFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: <Clock className="w-3 h-3" />,
        color: "bg-warning/10 text-warning",
        label: "Pending",
      },
      approved: {
        icon: <CheckCircle className="w-3 h-3" />,
        color: "bg-success/10 text-success",
        label: "Approved",
      },
      declined: {
        icon: <XCircle className="w-3 h-3" />,
        color: "bg-error/10 text-error",
        label: "Declined",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "cook":
        return <ChefHat className="w-4 h-4 text-secondary" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    declined: requests.filter((r) => r.status === "declined").length,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="space-y-6 ">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Verification Requests
        </h1>
        <p className="text-muted-foreground">
          Review and manage user verification requests
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold mt-1">{stats.all}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold mt-1">{stats.approved}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Declined</p>
              <p className="text-2xl font-bold mt-1">{stats.declined}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-error" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All ({stats.all})
        </button>
        <button
          onClick={() => setSelectedFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedFilter === "pending"
              ? "bg-warning text-warning-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setSelectedFilter("approved")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedFilter === "approved"
              ? "bg-success text-success-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Approved ({stats.approved})
        </button>
        <button
          onClick={() => setSelectedFilter("declined")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedFilter === "declined"
              ? "bg-error text-error-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Declined ({stats.declined})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-card border border-border rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3 hidden md:table-cell">Contact</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3 hidden lg:table-cell">Request Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((request) => (
              <tr
                key={request._id}
                className="border-t border-border hover:bg-muted/30 transition"
              >
                {/* User */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div>
                        <p className="font-medium mb-1 text-foreground">
                          {request.fullName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          UID: {request.uid}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {request.email}
                      </p>
                      <p className="text-xs text-muted-foreground lg:hidden mt-0.5">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Contact - Hidden on mobile */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {request.email}
                    </span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(request.role)}
                    <span className="capitalize">{request.role}</span>
                  </div>
                </td>

                {/* Request Date - Hidden on mobile/tablet */}
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(request.createdAt)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4">{getStatusBadge(request.status)}</td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {request.status === "pending" ? (
                      <>
                        <button
                          onClick={() => approve(request._id)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-success/10 text-success hover:bg-success/20 transition flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => decline(request._id)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-error/10 text-error hover:bg-error/20 transition flex items-center gap-1"
                        >
                          <ShieldX className="w-3 h-3" />
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-muted transition"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredRequests.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <p>
                      No {selectedFilter !== "all" ? selectedFilter : ""}{" "}
                      requests found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="text-sm text-muted-foreground">
        <p>
          Showing {filteredRequests.length} of {requests.length} total requests
        </p>
      </div>
    </section>
  );
};

export default VerifyRequest;
