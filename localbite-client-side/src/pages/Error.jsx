import { Link, useRouteError } from "react-router";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

const Error = () => {
  const error = useRouteError();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-6">
      <div className="max-w-lg text-center bg-card border border-border rounded-2xl p-8 shadow-xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-error/10 text-error">
            <AlertTriangle size={40} />
          </div>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Oops! Something went wrong
        </h1>
        {/* Message */}
        <p className="text-muted-foreground mb-6">
          The page you are looking for does not exist or an unexpected error
          occurred.
        </p>
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition"
          >
            <RefreshCcw size={18} />
            Reload Page
          </button>
        </div>
      </div>
    </section>
  );
};

export default Error;
