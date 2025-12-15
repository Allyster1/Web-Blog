import ArticleCard from "./ArticleCard";

export default function ArticleGrid({ articles }) {
   return (
      <div className="max-w-7xl mx-auto px-5 lg:px-24">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-center">
            {articles.map((article, idx) => (
               <ArticleCard key={idx} article={article} />
            ))}
         </div>
      </div>
   );
}
