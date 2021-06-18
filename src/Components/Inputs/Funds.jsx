import React from "react";

export default function Funds(props) {
  return (
    <div>
      <label>
        Add Funds:
        <input
          value={props.fundsAmount}
          onChange={props.handleFundsChange}
          type="number"
        />
      </label>
      <button onClick={props.handleAddFunds}>Add</button>
    </div>
  );
}
