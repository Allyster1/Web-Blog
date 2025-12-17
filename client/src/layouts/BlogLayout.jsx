import Footer from "../components/Footer";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import LatestPosts from "../components/blog/LatestPosts";
import PopularPosts from "../components/blog/PopularPosts";

import PostHeader from "../components/blog/PostHeader";
import BannerCard from "../components/blog/BannerCard";
import ContainerLayout from "./ContainerLayout";

export default function BlogLayout() {
  return (
    <>
      <Header className="hidden md:flex" />
      <ContainerLayout>
        <BannerCard />
        <PostHeader
          heading="Popular Post"
          text="Ideas, trends, and inspiration for a brighter future"
        />
        <PopularPosts />
        <PostHeader
          heading="Trending Post"
          text="Discover how innovation and creativity drive meaningful change"
        />
        <LatestPosts />
        <Pagination />
      </ContainerLayout>
      <Footer />
    </>
  );
}
