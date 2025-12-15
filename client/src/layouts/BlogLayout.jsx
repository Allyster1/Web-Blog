import Header from "../components/Header";
import ArticleGrid from "../components/ui/ArticleGrid";

const articles = [
   {
      author: "Saarah Mcbride",
      email: "saarah@email.com",
      date: "Nov 29, 2024",
      title: "Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01",
      text: "Success starts at 3 AM. Your alarm blares, your coffee spills, and suddenly your motivational TikTok guru is yelling at you through the screen. By 3:01, you’ve questioned every life choice—but hey, at least you’re rich in regret!",
      image: "https://images.unsplash.com/photo-1764957080454-dd997a855733?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   },
   {
      author: "Cruz Mcintyre",
      email: "cruz@email.com",
      date: "Nov 29, 2024",
      title: "Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01",
      text: "Europe is a treasure trove of culinary delights, offering a diverse array of flavors, techniques, and traditions.",
      image: "https://plus.unsplash.com/premium_photo-1709310749373-df152fc495fa?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   },
   {
      author: "Amna",
      email: "amna@email.com",
      date: "Nov 29, 2024",
      title: "Europe is a treasure trove of culinary delights, offering a diverse array of flavors, techniques, and traditions.",
      text: "by 3:01Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01",
      image: "https://images.unsplash.com/photo-1764970692776-ce5fb30a7509?q=80&w=1082&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   },
   {
      author: "Saarah Mcbride",
      email: "saarah@email.com",
      date: "Nov 29, 2024",
      title: "Wake Up at 3 AM… and Regret It by 3:01",
      text: "rope is a treasurerope is a treasurerope is a treasurerope is a treasurerope is a treasurerope is a treasurerope is a treasurerope is a treasurerope is a treasurerope is a treasure",
      image: "https://images.unsplash.com/photo-1764957080454-dd997a855733?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   },
   {
      author: "Cruz Mcintyre",
      email: "cruz@email.com",
      date: "Nov 29, 2024",
      title: "Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01",
      text: "Europe is a pe is a pe is a treasure trove of culinary delights, offering a diverse array of flavors, techniques, and traditions.",
      image: "https://plus.unsplash.com/premium_photo-1709310749373-df152fc495fa?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   },
   {
      author: "Amna",
      email: "amna@email.com",
      date: "Nov 29, 2024",
      title: "Europe is a treasure trove of culinary delights, offering a diverse array of flavors, techniques, and traditions.",
      text: "Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01Batman Teaches You How to Wake Up at 3 AM… and Regret It by 3:01",
      image: "https://images.unsplash.com/photo-1764970692776-ce5fb30a7509?q=80&w=1082&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   },
];

export default function BlogLayout() {
   return (
      <>
         <Header className="hidden md:flex" />
         <section className="py-12 px-6">
            <div className="text-center mb-12">
               <h1 className="font-bold text-3xl text-[#212121] mb-2">Exploring New Articles</h1>
               <p className="text-sm font-medium text-gray-600">Ideas, trends, and inspiration for a brighter future</p>
            </div>

            <div className="max-w-7xl mx-auto px-5 lg:px-24">
               <ArticleGrid articles={articles} />
            </div>
         </section>
      </>
   );
}
