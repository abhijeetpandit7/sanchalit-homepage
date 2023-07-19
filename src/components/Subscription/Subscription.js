import { memo } from "react";

export const Subscription = memo(() => {
  return (
    <div className="box mt-4 sm:mt-8">
      <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">
        Sanchalit Plus
      </h1>
      <p className="text-xl">$23.95/year</p>
      <h3 className="mt-4 sm:mt-8 mb-2 text-xl font-bold">Next renewal</h3>
      <p>$23.95/year on January 1, 2024 for service through January 1, 2025</p>
      <span className="mt-2 inline-block text-sm text-blue-400 cursor-pointer hover:underline">
        Turn off auto-renew
      </span>
    </div>
  );
});
