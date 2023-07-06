import { memo } from "react";
import "./upgrade.css";
import { iconCheck } from "../../utils";

export const Upgrade = memo(() => {
  return (
    <div className="box mt-4 sm:mt-8">
      <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">
        Choose a plan
      </h1>
      <ul className="plan-chooser">
        <li className="form-option">
          <div className="choose-plan-radio-wrapper">
            <i className="radio">{iconCheck}</i>
          </div>
          <div className="choose-plan-text-wrapper">
            <div className="choose-plan-term">
              <span className="period">Billed Monthly</span>
            </div>
            <span className="choose-plan-price">$2.95/month</span>
          </div>
        </li>
        <li className="form-option active">
          <div className="choose-plan-radio-wrapper">
            <i className="radio">{iconCheck}</i>
          </div>
          <div className="choose-plan-text-wrapper">
            <div className="choose-plan-term">
              <span className="period">Billed Yearly</span>
              <span className="choose-plan-badge">Save 32%!</span>
            </div>
            <span className="choose-plan-price">$23.95/year</span>
            <span className="choose-plan-description">
              Equal to $1.99/month
            </span>
          </div>
        </li>
      </ul>
      <button className="mt-6 py-2 px-12 font-bold text-white rounded-lg bg-blue-400 rounded-3xl hover:bg-blue-300">
        Upgrade
      </button>
    </div>
  );
});
