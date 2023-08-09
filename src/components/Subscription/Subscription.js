import { memo, useEffect, useState } from "react";
import { History } from "../History/History";
import {
  formatDate,
  getNextRenewalDate,
  getSubscriptionData,
  updateSubscriptionAutoRenewalStatus,
} from "../../utils";

export const Subscription = memo(({ token }) => {
  const [subscriptionData, setSubscriptionData] = useState({});
  const [isUpdatingAutoRenewalStatus, setIsUpdatingAutoRenewalStatus] =
    useState(false);

  useEffect(() => {
    (async () => {
      const subscriptionDataResponse = await getSubscriptionData(token);
      if (subscriptionDataResponse?.success) {
        const {
          currentSubscription,
          charges,
          upcomingInvoice,
          updatePaymentMethodUrl,
        } = subscriptionDataResponse;
        await setSubscriptionData({
          currentSubscription,
          charges,
          upcomingInvoice,
          updatePaymentMethodUrl,
        });
      }
    })();
  }, []);

  if (Object.keys(subscriptionData).length === 0) return null;

  const {
    currentSubscription: { endsAt, renewsAt, friendlyAmount, interval, id },
    charges,
    upcomingInvoice,
    updatePaymentMethodUrl,
  } = subscriptionData;

  const handleAutoRenewToggle = async (cancelled) => {
    if (isUpdatingAutoRenewalStatus) return;
    await setIsUpdatingAutoRenewalStatus(true);
    const currentSubscriptionResponse =
      await updateSubscriptionAutoRenewalStatus(token, id, cancelled);
    await setSubscriptionData((prevValue) => ({
      ...prevValue,
      currentSubscription: {
        ...prevValue.currentSubscription,
        ...currentSubscriptionResponse,
      },
    }));
    await setIsUpdatingAutoRenewalStatus(false);
  };

  return (
    <>
      <div className="box mt-4 sm:mt-8">
        <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">
          Sanchalit Plus
        </h1>
        <p className="text-xl">{friendlyAmount}</p>
        {endsAt ? (
          <>
            <p className="mt-2 sm:mt-4">
              You've turned off auto-renew. Your current plan will remain active
              until
              <strong className="text-neutral-500">
                {" "}
                {formatDate(endsAt)}{" "}
              </strong>
              for service
            </p>
            <button
              className="mt-6 py-2 px-8 font-bold text-white rounded-lg bg-blue-400 rounded-3xl uppercase hover:bg-blue-300"
              onClick={() => handleAutoRenewToggle(false)}
              disabled={isUpdatingAutoRenewalStatus}
            >
              Turn on auto-renew
            </button>
          </>
        ) : (
          <>
            <h3 className="mt-4 sm:mt-8 mb-2 text-xl font-bold">
              Next renewal
            </h3>
            <p>
              {`$${upcomingInvoice}/${interval} on 
            ${formatDate(renewsAt)} for service
            through ${formatDate(getNextRenewalDate(renewsAt, interval))}`}
            </p>
            <span
              className="mt-2 inline-block text-sm text-blue-400 hover:underline"
              style={{
                cursor: isUpdatingAutoRenewalStatus ? "default" : "pointer",
              }}
              onClick={() => handleAutoRenewToggle(true)}
            >
              {isUpdatingAutoRenewalStatus
                ? "Processing..."
                : "Turn off auto-renew"}
            </span>
          </>
        )}
      </div>
      <History {...{ charges, updatePaymentMethodUrl }} />
    </>
  );
});
