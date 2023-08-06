import { memo, useEffect, useState } from "react";
import {
  formatDate,
  getNextRenewalDate,
  getSubscriptionData,
} from "../../utils";
export const Subscription = memo(({ token }) => {
  const [subscriptionData, setSubscriptionData] = useState({});

  useEffect(() => {
    (async () => {
      const subscriptionDataResponse = await getSubscriptionData(token);
      if (subscriptionDataResponse?.success) {
        const {
          currentSubscription,
          upcomingInvoice,
        } = subscriptionDataResponse;
        await setSubscriptionData({
          currentSubscription,
          upcomingInvoice,
        });
      }
    })();
  }, []);

  if (Object.keys(subscriptionData).length === 0) return null;

  const {
    currentSubscription: { endsAt, renewsAt, friendlyAmount, interval },
    upcomingInvoice,
  } = subscriptionData;

  return (
    <div className="box mt-4 sm:mt-8">
      <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">
        Sanchalit Plus
      </h1>
      <p className="text-xl">{friendlyAmount}</p>
      {renewsAt ? (
        <>
          <h3 className="mt-4 sm:mt-8 mb-2 text-xl font-bold">Next renewal</h3>
          <p>
            {`$${upcomingInvoice}/${interval} on 
        ${formatDate(renewsAt)} for service
        through ${formatDate(getNextRenewalDate(renewsAt, interval))}`}
          </p>
          <span className="mt-2 inline-block text-sm text-blue-400 cursor-pointer hover:underline">
            Turn off auto-renew
          </span>
        </>
      ) : (
        <>
          <p className="mt-2 sm:mt-4">
            You've turned off auto-renew. Your current plan will remain active
            until
            <strong className="text-neutral-500"> {formatDate(endsAt)} </strong>
            for service
          </p>
          <button className="mt-6 py-2 px-8 font-bold text-white rounded-lg bg-blue-400 rounded-3xl uppercase hover:bg-blue-300">
            Turn on auto-renew
          </button>
        </>
      )}
    </div>
  );
});
