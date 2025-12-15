export default function ArticleCard({ article }) {
   return (
      <div className="bg-white shadow-md overflow-hidden flex flex-col transition hover:shadow-lg max-w-xs">
         <img className="w-full h-64 object-cover" src={article.image} alt={article.title} />
         <div className="p-3 flex flex-col flex-1">
            <span className="text-xs text-[#212121] mb-2.5">Author: {article.email}</span>
            <h2 className="text-2xl font-medium text-[#212121] line-clamp-2 leading-8 mb-1">{article.title}</h2>
            <p className="min-h-15 text-sm text-[#212121] line-clamp-3 mb-2">{article.text}</p>
            <span className="text-[#9A9A9A] text-xs text-right">· {article.date}</span>
            <button className="w-36 text-black text-left leading-3.5 text-sm cursor-pointer bg-[#F4F4F4] py-3.5 px-3.5 font-medium uppercase hover:underline hover:bg-[#159e75] hover:text-white transition-colors duration-300 ease-in-out">
               Read More <span className="ml-2">&rarr;</span>
            </button>
         </div>
      </div>
   );
}
