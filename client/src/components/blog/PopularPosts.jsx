export default function PopularPosts() {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <a href="#" className="block">
               <img
                  className="w-full h-64 object-cover"
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Sustainable Travel Tips"
               />
               <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                     Sustainable Travel Tips: Reducing Your Carbon Footprint
                  </h3>
                  <div className="flex items-center gap-3 mt-4">
                     <span className="text-sm font-medium">Clara Wilson</span>
                     <span className="text-sm text-muted-foreground ml-auto">Nov 28, 2024</span>
                  </div>
               </div>
            </a>
         </div>

         <div className="flex flex-col gap-6">
            <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
               <a href="#" className="block sm:flex">
                  <div className="w-full sm:w-48 h-48 shrink-0">
                     <img
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
                        alt="Chasing Sunsets"
                     />
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                     <h3 className="text-lg font-bold mb-3 line-clamp-2">
                        Chasing Sunsets: The World's Most Scenic Destinations
                     </h3>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Amelia Scott</span>
                        <span className="text-sm text-muted-foreground ml-auto">Nov 29, 2026</span>
                     </div>
                  </div>
               </a>
            </div>

            <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
               <a href="#" className="block sm:flex">
                  <div className="w-full sm:w-48 h-48 shrink-0">
                     <img
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop"
                        alt="Hidden Gems"
                     />
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                     <h3 className="text-lg font-bold mb-3 line-clamp-2">
                        Hidden Gems: Europe's Best Kept Secret Destinations
                     </h3>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Oliver Grant</span>
                        <span className="text-sm text-muted-foreground ml-auto">Nov 29, 2026</span>
                     </div>
                  </div>
               </a>
            </div>
         </div>
      </div>
   );
}
