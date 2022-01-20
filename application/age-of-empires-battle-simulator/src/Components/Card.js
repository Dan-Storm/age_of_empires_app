import React from 'react';
import './Card.css'

function Card({name,hitpoints,attack,reloadtime}){   
    return (
        <div className='card-container'>
            <h2>{name}</h2>

            <ul>
            <li>Hit Points: {hitpoints}</li>
            <li>Attack: {attack}</li>
            <li>Reload Time: {reloadtime} seconds</li>
            </ul>  
        </div>
    );
}

export default Card;
