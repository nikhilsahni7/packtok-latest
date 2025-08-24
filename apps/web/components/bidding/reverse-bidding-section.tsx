import { cn } from "@packtok/ui/lib/utils";
import { MachineCard } from "./machine-card";

const reverseBiddingMachines = [
  { id: 1, name: "Machine Name", price: "$200,000" },
  { id: 2, name: "Machine Name", price: "$200,000" },
  { id: 3, name: "Machine Name", price: "$200,000" },
  { id: 4, name: "Machine Name", price: "$200,000" },
];

export function ReverseBiddingSection() {
  const handleJoinAuction = (machineId: number) => {
    console.log(`Joining auction for machine ${machineId}`);
    // Handle join auction logic here
  };

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-8">
        <h2
          className={cn(
            // Typography
            "text-2xl md:text-3xl font-bold mb-2",

            // Colors
            "text-gray-900"
          )}
        >
          Reverse Bidding
        </h2>
      </div>

      {/* Machine Cards Grid */}
      <div
        className={cn(
          // Layout & box model
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6",

          // Responsive spacing
          "max-w-4xl mx-auto"
        )}
      >
        {reverseBiddingMachines.map((machine) => (
          <MachineCard
            key={machine.id}
            machineName={machine.name}
            startingPrice={machine.price}
            onJoinAuction={() => handleJoinAuction(machine.id)}
          />
        ))}
      </div>
    </section>
  );
}
