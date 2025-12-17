export default function Write() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#212121] mb-6">
          Write Article
        </h1>
        <p className="text-[#718096]">
          This is a protected route. Only authenticated users can see this.
        </p>
      </div>
    </div>
  );
}
