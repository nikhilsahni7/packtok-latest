import { cn } from "@packtok/ui/lib/utils";
import { MachineCard } from "./machine-card";

const liveBiddingMachines = [
  { id: 1, name: "Machine Name", price: "$200.000" },
  { id: 2, name: "Machine Name", price: "$200.000" },
  { id: 3, name: "Machine Name", price: "$200.000" },
];

export function LiveBiddingSection() {
  const handleJoinAuction = (machineId: number) => {
    console.log(`Joining auction for machine ${machineId}`);
    // Handle join auction logic here
  };

  return (
    <section className="w-full py-8 lg:py-12 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <h2
            className={cn(
              // Typography
              "text-3xl md:text-4xl lg:text-5xl font-black mb-4",

              // Colors
              "text-gray-900"
            )}
          >
            Live Bidding
          </h2>
        </div>

        {/* Machine Cards Row */}
        <div
          className={cn(
            // Layout & box model
            "flex gap-8 lg:gap-12 overflow-x-auto pb-4",

            // Responsive spacing
            "w-full",

            // Scrollbar styling
            "scrollbar-hide"
          )}
        >
          {liveBiddingMachines.map((machine) => (
            <MachineCard
              key={machine.id}
              machineName={machine.name}
              startingPrice={machine.price}
              onJoinAuction={() => handleJoinAuction(machine.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
