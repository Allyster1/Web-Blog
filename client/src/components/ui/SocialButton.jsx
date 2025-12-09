export default function SocialButton({ image, text }) {
   return (
      <button
         type="button"
         className="flex items-center text-sm leading-5 py-2 px-4 border rounded-4xl hover:bg-gray-300 border-gray-300 cursor-pointer focus:border-gray-500 focus:outline-none"
      >
         <img src={image} alt="social-icon" className="w-4 h-4 mr-9" />
         {text}
      </button>
   );
}
