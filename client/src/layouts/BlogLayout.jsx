import Header from "../components/Header";
import PopularPosts from "../components/blog/PopularPosts";

import PostHeader from "../components/blog/PostHeader";
import MainCard from "../components/blog/mainCard";
import ContainerLayout from "./ContainerLayout";

export default function BlogLayout() {
   return (
      <>
         <Header className="hidden md:flex" />
         <ContainerLayout>
            <MainCard />
            <PostHeader heading="Popular Post" text="Ideas, trends, and inspiration for a brighter future" />
            <PopularPosts />
            <PostHeader heading="Trending Post" text="Discover how innovation and creativity drive meaningful change" />
         </ContainerLayout>
      </>
   );
}
