import React from "react";

const PriceCell = ({ price, isCheapest }) => {
  if (price === null || price === undefined) {
    return <td className="text-muted">N/A</td>;
  }

  return (
    <td className={isCheapest ? "cheapest-cell fw-bold" : ""}>
      {`$${price.toFixed(2)}`}
    </td>
  );
};

export default PriceCell;
