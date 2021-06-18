import React from "react";

export default function Wager(props) {
  return (
    <div>
      <label>
        Enter wager:
        <input
          value={props.wagerAmount}
          onChange={props.handleWagerChange}
          type="number"
        />
      </label>
    </div>
  );
}