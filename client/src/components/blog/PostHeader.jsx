export default function PostHeader({ heading, text }) {
  return (
    <>
      <header className="mt-15 text-center px-4 pb-10">
        <h1 className="text-3xl font-bold text-[#212121] leading-8 pb-2">
          {heading}
        </h1>
        <p className="">{text}</p>
      </header>
    </>
  );
}
