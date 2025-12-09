export default function InputField({ id, type, placeholder, label, required = false }) {
   return (
      <div className="flex flex-col">
         <label htmlFor={id} className="text-[#718096] text-sm leading-5 tracking-tight mb-2.5">
            {label}
         </label>
         <input
            type={type}
            name={id}
            id={id}
            placeholder={placeholder}
            required={required}
            className="border rounded-2xl px-4 py-2.5 border-gray-300 focus:border-gray-500 focus:outline-none"
         />
      </div>
   );
}
