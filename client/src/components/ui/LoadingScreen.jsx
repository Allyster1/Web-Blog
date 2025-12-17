export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 border-4 border-[#F4F4F4] border-t-[#53946c] rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-[#718096] text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
