import { memo } from "react";
import {
  amexIcon,
  cardErrorIcon,
  dinersIcon,
  discoverIcon,
  eloIcon,
  iconCheckFilled,
  jcbIcon,
  mastercardIcon,
  unionpayIcon,
  visaIcon,
  formatDate,
} from "../../utils";

const getCardIcon = (brand) => {
  switch (brand) {
    case "visa":
      return visaIcon;
    case "mastercard":
      return mastercardIcon;
    case "amex":
      return amexIcon;
    case "discover":
      return discoverIcon;
    case "diners":
      return dinersIcon;
    case "jcb":
      return jcbIcon;
    case "unionpay":
      return unionpayIcon;
    case "elo":
      return eloIcon;
    default:
      return cardErrorIcon;
  }
};

export const History = memo(({ charges, updatePaymentMethodUrl }) => {
  if (charges.length === 0) return null;

  return (
    <div className="box mt-4 sm:mt-8">
      <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold">History</h1>
      <table className="w-full">
        <thead>
          <tr className="uppercase">
            <th className="py-3 px-1.5"></th>
            <th className="py-3 px-1.5 font-normal opacity-50 text-left">
              Date
            </th>
            <th className="py-3 px-1.5 font-normal opacity-50 text-left">
              Payment Method
            </th>
            <th className="py-3 px-1.5 font-normal opacity-50 text-right">
              Amount
            </th>
            <th className="py-3 px-1.5 font-normal opacity-50 text-right">
              Invoice
            </th>
          </tr>
        </thead>
        <tbody>
          {charges.map((charge, index) => (
            <tr className="border-t border-gray-200" key={index}>
              <td className="py-3 px-1.5 pl-3">
                <i title="Charge succeeded">{iconCheckFilled}</i>
              </td>
              <td className="py-3 px-1.5">{formatDate(charge.date, false)}</td>
              <td className="py-3 px-1.5">
                <span className="pr-1 inline-block align-middle">
                  {getCardIcon(charge.card.brand)}
                </span>
                <span> ending in {charge.card.last_four} </span>
              </td>
              <td className="py-3 px-1.5 text-right"> ${charge.amount} </td>
              <td
                className="py-3 px-1.5 cursor-pointer text-right text-blue-400 hover:underline"
                onClick={() => window.open(charge.invoice_url)}
              >
                Download
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200" />
        </tfoot>
      </table>
      <span
        className="mt-4 inline-block text-sm text-blue-400 cursor-pointer hover:underline"
        onClick={() => window.open(updatePaymentMethodUrl)}
      >
        Update payment method
      </span>
    </div>
  );
});
