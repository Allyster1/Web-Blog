import BannerImage from "../../assets/BannerCardImage.avif";

export default function BannerCard() {
  return (
    <div className="relative mt-12 w-auto max-w-5xl mx-auto rounded-xl overflow-hidden">
      <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={BannerImage}
          alt="Banner"
        />

        <div className="absolute inset-0 bg-linear-to-br opacity-60 from-[#9ba09d] via-[#0b0e0c] to-[#3e4144cc]" />

        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 text-white">
          <div className="text-center space-y-4 sm:space-y-5 md:space-y-6">
            <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-bold leading-tight drop-shadow-lg">
              Where Stories Come to Life
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl opacity-90 font-light">
              Discover. Write. Inspire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
