import { memo, useEffect, useState } from "react";
import "./upgrade.css";
import {
  iconCheck,
  URL_MONTHLY_CHECKOUT,
  URL_YEARLY_CHECKOUT,
  getSubscriptionPlans,
} from "../../utils";

export const Upgrade = memo(() => {
  const [plans, setPlans] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    (async () => {
      const subscriptionPlansResponse = await getSubscriptionPlans();
      if (subscriptionPlansResponse?.success) {
        await setPlans(subscriptionPlansResponse.plans);
        await setSelectedPlan(subscriptionPlansResponse.plans.yearly.id);
      }
    })();
  }, []);

  const redirectToCheckout = () =>
    (window.location.href = selectedPlan.includes("month")
      ? URL_MONTHLY_CHECKOUT
      : URL_YEARLY_CHECKOUT);

  return (
    <div className="box mt-4 sm:mt-8">
      <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">
        Choose a plan
      </h1>
      <ul className="plan-chooser">
        {Object.values(plans).map((plan) => (
          <li
            className={`form-option ${
              plan.id === selectedPlan ? "active" : ""
            }`}
            onClick={() => setSelectedPlan(plan.id)}
            key={plan.id}
          >
            <div className="choose-plan-radio-wrapper">
              <i className="radio">{iconCheck}</i>
            </div>
            <div className="choose-plan-text-wrapper">
              <div className="choose-plan-term">
                <span className="period capitalize">
                  Billed {plan.interval}ly
                </span>
                {plan.badgeText && (
                  <span className="choose-plan-badge">{plan.badgeText}</span>
                )}
              </div>
              <span className="choose-plan-price">{plan.friendlyPlanRate}</span>
              {plan.friendlyMonthlyPrice && (
                <span className="choose-plan-description">
                  Equal to ${plan.friendlyMonthlyPrice}/month
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-6 py-2 px-12 font-bold text-white rounded-lg bg-blue-400 rounded-3xl hover:bg-blue-300"
        onClick={redirectToCheckout}
      >
        Upgrade
      </button>
    </div>
  );
});
