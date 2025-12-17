import BannerImage from "../../assets/BannerCardImage.avif";
import { Link } from "react-router";

export default function BannerCard() {
  return (
    <div className="cursor-pointer relative mt-12 w-auto max-w-3x1 mx-auto rounded-xl overflow-hidden">
      <Link to="/auth/login">
        <div className="relative w-full h-[300px] sm:h-[350px] md:aspect-21/9">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={BannerImage}
            alt="A Foodie's Guide to Europe"
          />

          <div className="absolute inset-0 bg-linear-to-br opacity-60 from-[#9ba09d] via-[#0b0e0c] to-[#3e4144cc]" />

          <div className="absolute inset-0 flex flex-col p-4 sm:p-6 md:p-8 text-white">
            <div className="w-full md:w-1/2">
              <h1 className="text-[1rem] sm:text-[1.2rem] md:text-[1.5rem] lg:text-[1.5rem] font-bold leading-tight">
                A Brief Look at Photography’s Evolution: Photography as an Art
                Form
              </h1>
            </div>

            <div className="mt-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0">
              <p className="text-sm md:text-base">Nov 13, 2025</p>

              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 self-start sm:self-end">
                <div className="text-sm text-white">
                  <p className="font-semibold">Allyster1</p>
                  <p className="text-xs opacity-90">Author</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
