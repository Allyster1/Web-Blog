export default function TextareaField({
  id,
  placeholder,
  label,
  required = false,
  value,
  onChange,
  rows = 6,
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-[#718096] text-sm leading-5 tracking-tight mb-2.5"
      >
        {label}
      </label>
      <textarea
        name={id}
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        rows={rows}
        className="rounded-2xl px-4 py-2.5 border border-gray-300 focus:border-gray-500 focus:outline-none resize-y min-h-[150px]"
      />
    </div>
  );
}
