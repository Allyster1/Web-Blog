import BlogCard from "../ui/BlogCard";

export default function PopularPosts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BlogCard
        variant="large"
        img="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        title="Sustainable Travel Tips: Reducing Your Carbon Footprint"
        author="Clara Wilson"
        date="Nov 28, 2024"
      />

      <div className="flex flex-col gap-6">
        <BlogCard
          variant="horizontal"
          img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
          title="Chasing Sunsets: The World's Most Scenic Destinations"
          author="Amelia Scott"
          date="Nov 29, 2026"
        />

        <BlogCard
          variant="horizontal"
          img="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop"
          title="Hidden Gems: Europe's Best Kept Secret Destinations"
          author="Oliver Grant"
          date="Nov 29, 2026"
        />
      </div>
    </div>
  );
}
