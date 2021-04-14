import React from "react";
import "./Card.css";

export default function Card(props) {
  function handleClick() {
    props.handleSelectCard(props.index);
  }

  return (
    <div
      className={props.selected ? "card selected" : "card"}
      rank={props.rank}
      suit={props.suit}
      selected={props.selected}
      style={{ backgroundImage: `url(${props.image})` }}
      onClick={handleClick}
    ></div>
  );
}
