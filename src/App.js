import React, { useState } from 'react';
import './App.css';
import Card from "./Components/Card/Card";

function App() {
  let [hand, setHand] = useState([]);
  let [disabled, setDisabled] = useState(true);
  let [evaluation, setEvaluation] = useState("");

  async function drawFive() {
    setEvaluation("");
    setHand([]);
    let newHand = [];
    await fetch("https://deckofcardsapi.com/api/deck/alanuelczxce/shuffle/");
    fetch("https://deckofcardsapi.com/api/deck/alanuelczxce/draw/?count=5")
      .then((res) => res.json())
      .then((res) => {
        for (let cardObj of res.cards) {
          let newCard = {
            value: cardObj.value,
            suit: cardObj.suit,
            image: cardObj.image,
            selected: false
          };
          newHand.push(newCard);
        }
        setHand(newHand);
        setDisabled(!disabled);
      });
  }

  async function reDraw() {
    const updatedHand = hand.slice();
    for (let card of updatedHand) {
      if (card.selected) {
        await fetch(
          "https://deckofcardsapi.com/api/deck/alanuelczxce/draw/?count=1"
        )
          .then((res) => res.json())
          .then((res) => {
            card.value = res.cards[0].value;
            card.suit = res.cards[0].suit;
            card.image = res.cards[0].image;
            card.selected = false;
          });
      }
    }
    setHand(updatedHand);
    setDisabled(!disabled);
    evaluate(hand);
  }

  function handleSelectCard(index) {
    const updatedHand = hand.map((card, index0) => {
      if (index === index0) {
        return {
          ...card,
          selected: !card.selected
        };
      } else {
        return card;
      }
    });

    setHand(updatedHand);
  }

  function isRoyalFlush(hand, aceHighStraight = ["10", "ACE", "JACK", "KING", "QUEEN"]) {
    let ranks = [];
    for (let card of hand) {
      ranks.push(card.value);
    }
    ranks.sort()
    return isFlush(hand) && ranks.every((v, i) => v === aceHighStraight[i]);
  }

  function isFlush(hand) {
    let suits = [];
    for (let card of hand) {
      suits.push(card.suit);
    }
    return new Set(suits).size === 1;
  }

  function isFiveHighStraight(
    hand,
    fiveHighStraight = ["2", "3", "4", "5", "ACE"]
  ) {
    let ranks = [];
    for (let card of hand) {
      ranks.push(card.value);
    }
    ranks.sort();
    return ranks.every((v, i) => v === fiveHighStraight[i]);
  }

  function isStraight(hand, counts) {
    let ranks = [];
    for (let card of hand) {
      if (card.value === "JACK") {
        ranks.push(11);
      } else if (card.value === "QUEEN") {
        ranks.push(12);
      } else if (card.value === "KING") {
        ranks.push(13);
      } else if (card.value === "ACE") {
        ranks.push(14);
      } else {
        ranks.push(Number(card.value));
      }
    }
    ranks.sort();
    return ranks[4] - ranks[0] === 4 && Object.values(counts).length === 5;
  }

  function isMultiCard(counts, jacksOrBetter = ["JACK", "QUEEN", "KING", "ACE"]) {
    if (Object.values(counts).length === 2) {
      if (Object.values(counts).includes(1)) {
        return "FOUR OF A KIND!";
      } else {
        return "FULL HOUSE!";
      }
    } else if (Object.values(counts).length === 3) {
      if (Object.values(counts).includes(3)) {
        return "THREE OF A KIND!";
      } else {
        return "TWO PAIR!";
      }
    } else if (Object.values(counts).length === 4 && jacksOrBetter.includes(getPairValue(counts))) {
      return "PAIR! (JACKS OR BETTER)";
    } else {
      return "High card!";
    }
  }

  function getPairValue(object) {
    return Object.keys(object).find((key) => object[key] === 2);
  }

  function evaluate(hand) {
    let counts = {};
    for (let card of hand) {
      if (card.value in counts) {
        counts[card.value] += 1;
      } else {
        counts[card.value] = 1;
      }
    }
    if (
      isFlush(hand) &&
      (isFiveHighStraight(hand) || isStraight(hand, counts))
    ) {
      setEvaluation("STRAIGHT FLUSH!");
    } else if (isFlush(hand)) {
      setEvaluation("FLUSH!");
    } else if (isFiveHighStraight(hand) || isStraight(hand, counts)) {
      setEvaluation("STRAIGHT!");
    } else {
      setEvaluation(isMultiCard(counts));
    }
  }

  let currentHand = hand.map((card, i) => (
    <Card
      key={i}
      index={i}
      rank={card.value}
      suit={card.suit}
      image={card.image}
      selected={card.selected}
      handleSelectCard={handleSelectCard}
    />
  ));

  return (
    <>
      <div className="App">{currentHand}</div>
      <div className="button-container">
        <button onClick={drawFive} disabled={!disabled}>
          DEAL
        </button>
        <button onClick={reDraw} disabled={disabled}>
          REDRAW
        </button>
      </div>
      <div className="evaluation">{evaluation}</div>
    </>
  );
}

export default App;
