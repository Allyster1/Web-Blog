export default function ContainerLayout({ children, className = "" }) {
   return <div className={`max-w-6xl md:5x1 mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
