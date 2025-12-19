import ArticleCard from "./ArticleCard";

export default function ArticleGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <ArticleCard
        img="https://images.unsplash.com/photo-1764778607908-3f115dc671ba?q=80&w=1123&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        author="Test Person"
        title="Ultimate Guide to Solo Travel"
        date="Dec 15, 2025"
      />
      <ArticleCard
        img="https://images.unsplash.com/photo-1765834082429-93991ab1c38e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        author="Test Person"
        title="Ultimate Guide to Solo Travel"
        date="Dec 15, 2025"
      />
      <ArticleCard
        img="https://images.unsplash.com/photo-1765871320521-7eb7c98a1061?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        author="Test Person"
        title="Ultimate Guide to Solo Travel"
        date="Dec 15, 2025"
      />
    </div>
  );
}
