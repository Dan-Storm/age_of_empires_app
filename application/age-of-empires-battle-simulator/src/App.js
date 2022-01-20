import React from 'react';
import './App.css';
import Card from './Components/Card'
import { useState, useEffect } from 'react';


function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [winner, setWinner] = useState(null);

  function randNumGen()
  {
    return Math.floor(Math.random() * 104) - 1;
  }

  var num1 = randNumGen();
  var num2 = randNumGen();
  var twoUnits = [];

  useEffect(() => {
        fetch("https://age-of-empires-2-api.herokuapp.com/api/v1/units")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          twoUnits.push(result.units[num1], result.units[num2])
          setItems(twoUnits);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  },[])

  //reduces each unit's hitpoints until they fall below 0
  //each iteration through the where loop adds the number of seconds the opposing unit takes to reload
  //comparing the number of seconds each unit would survive attack from the other gives us the winner
  function fight(unit1, unit2)
  { 
    var unit1HitPoints = unit1.hit_points;
    var unit1Attack = unit1.attack;
    var unit1Reload = unit1.reload_time;
    var unit2HitPoints = unit2.hit_points;
    var unit2Attack = unit2.attack;
    var unit2Reload = unit2.reload_time;
    var unit1FightRounds = 0;
    var unit2FightRounds = 0;

    while (unit1HitPoints > 0) 
    { 
      console.log(unit1HitPoints)
      unit1FightRounds += unit2Reload;
      unit1HitPoints -= unit2Attack;
    }
    console.log(unit1.name + " would Last " + unit1FightRounds + " seconds")
    while (unit2HitPoints > 0) 
    {
      console.log(unit2HitPoints)
      unit2FightRounds += unit1Reload
      unit2HitPoints -= unit1Attack
    }
    console.log(unit2.name + " would Last " + unit2FightRounds + " seconds")
    //outcome when neither unit has an attack value
    if(isNaN(unit1FightRounds) && isNaN(unit2FightRounds))
    {
      setWinner("It's a draw") 
      console.log(winner)
    }
    //outcome when unit2 does not have an attack value
    else if(isNaN(unit1FightRounds))
    {
      setWinner(unit1.name + " is the winner") 
      console.log(winner + " is the winner")
    }
    //outcome when unit1 does not have an attack value
    else if(isNaN(unit2FightRounds))
    {
      setWinner(unit2.name + " is the winner") 
      console.log(winner + " is the winner")
    }    
    //outcome when each unit reduce the the other's hitpoints to 0 in the same amount of time
    else if(unit1FightRounds === unit2FightRounds)
    {
      setWinner("Both fighters perish simultaneously")
    }
    //outcome when unit1 survives combat longer than unit2
    else if(unit1FightRounds > unit2FightRounds)
    {
      setWinner(unit1.name + " is the winner") 
      console.log(unit1.name + " is the winner")
    }
    //outcome when unit2 survives combat longer than unit1
    else
    {
      setWinner(unit2.name + " is the winner") 
      console.log(unit2.name + " is the winner")
    }
    setIsClicked(true)
  }

  if (error) 
  {
    return <div>Error: {error.message}</div>;
  } 
  else if (!isLoaded) 
  {
    return <div>Getting two random units...</div>;
  } 
  else {
    if(!isClicked)
    {    return (
      //view before the fight button is clicked
      <div id="wrapper">
        {items.map(item => (
            <Card key={item.id}
            name={item.name}
            hitpoints={item.hit_points}
            attack={item.attack}
            reloadtime={item.reload_time}
            />
        ))}
        <button onClick={()=>fight(items[0], items[1])}> MAKE THEM FIGHT </button>
    </div>    
    )}
    else
    { return(
      //view after the fight button is clicked
      <div id="wrapper">
        <h1>{winner}</h1>
        <h2> Reload the page to play again </h2>
    </div>     
    )};
  }
}

export default App;
