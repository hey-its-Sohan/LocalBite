import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Users,
  Eye,
  Target,
  BadgeCheck,
} from "lucide-react";

const Verify = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const submitRequest = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/verify", {
        uid: user.uid,
      });
      setMessage("Verification request submitted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Request failed. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Star className="w-5 h-5 text-primary" />,
      title: "Increased Trust",
      description: "Build credibility with other users",
    },
    {
      icon: <Eye className="w-5 h-5 text-secondary" />,
      title: "Enhanced Visibility",
      description: "Get priority placement in search results",
    },
    {
      icon: <Users className="w-5 h-5 text-accent" />,
      title: "Community Recognition",
      description: "Stand out as a verified member",
    },
    {
      icon: <Target className="w-5 h-5 text-success" />,
      title: "Exclusive Features",
      description: "Access premium tools and insights",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <BadgeCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Get Verified
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our community of trusted members and unlock exclusive benefits
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Benefits Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Why Get Verified?
              </h3>
              <p className="text-sm text-muted-foreground">
                Benefits of being a verified member
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-warning" />
              <p className="text-sm font-medium">What to expect</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span>Review process takes 1-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span>You'll be notified by email</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span>No payment required</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Request Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Request Verification
              </h3>
              <p className="text-sm text-muted-foreground">
                Submit your verification request
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Requesting as
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {user?.displayName?.[0] || user?.email?.[0] || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Process Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">
                Verification Process
              </h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-medium text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <span className="text-muted-foreground">
                    Submit your request
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-medium text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <span className="text-muted-foreground">
                    Our team reviews your profile
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-medium text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <span className="text-muted-foreground">
                    Get notified of the result
                  </span>
                </li>
              </ol>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitRequest}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Request Verification
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  messageType === "success"
                    ? "bg-success/10 border border-success/20"
                    : "bg-error/10 border border-error/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-error mt-0.5" />
                  )}
                  <p
                    className={`text-sm ${
                      messageType === "success" ? "text-success" : "text-error"
                    }`}
                  >
                    {message}
                  </p>
                </div>
              </div>
            )}

            {/* Note */}
            <div className="text-xs text-muted-foreground text-center">
              <p>
                By submitting, you agree to our verification process and terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">24-72h</div>
          <p className="text-sm text-muted-foreground">Average review time</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-success mb-2">95%</div>
          <p className="text-sm text-muted-foreground">Approval rate</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">10k+</div>
          <p className="text-sm text-muted-foreground">Verified members</p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
