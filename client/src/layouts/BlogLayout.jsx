import Footer from "../components/footer/Footer";
import Header from "../components/Header";
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
          heading="Trending Post"
          text="Ideas, trends, and inspiration for a brighter future"
        />
        <PopularPosts />
        <PostHeader
          heading="Latest Posts"
          text="Discover how innovation and creativity drive meaningful change"
        />
        <LatestPosts />
      </ContainerLayout>
      <Footer />
    </>
  );
}
