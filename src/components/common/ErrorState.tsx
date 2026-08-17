import { useRouter } from "@tanstack/react-router";
import ReloadIconSvg from "../svgs/icons/ReloadIconSVG";

type ErrorStateProps = {
  statusCode?: number;
  title?: string;
  message?: string;
  onRetry?: () => void;
};

const getErrorConfig = (statusCode?: number) => {
  switch (statusCode) {
    case 404:
      return {
        title: "Page Not Found",
        message: "The page you’re looking for doesn’t exist or has been moved.",
      };

    case 403:
      return {
        title: "Access Denied",
        message: "You don’t have permission to view this content.",
      };

    case 500:
      return {
        title: "Server Error",
        message: "Something went wrong on our end. Please try again later.",
      };

    default:
      return {
        title: "Something went wrong",
        message: "We couldn’t load the data. Please try again.",
      };
  }
};

export default function ErrorState({
  title,
  message ,
  statusCode,
  onRetry,
}: ErrorStateProps) {

  const config = getErrorConfig(statusCode);

   const router = useRouter();
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center py-20 px-4">
      
      {/* Icon */}
      <div className="bg-red-500/30 text-red-400 p-4 rounded-full mb-6">
        <ReloadIconSvg />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-2">
        {title || config.title}
      </h2>

      {/* Message */}
      <p className="text-gray-400 max-w-md mb-6">
        {message || config.message}
      </p>

      <div className="grid grid-cols-2 gap-3">

        {/* Retry */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2  bg-white cursor-pointer text-black rounded-lg hover:bg-gray-200 transition"
          >
            Retry
          </button>
        )}

        {/* Dashboard */}
        <button
           onClick={() => router.navigate({ to: "/dashboard" })}
          className="px-5 py-2 border cursor-pointer border-gray-600 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
}