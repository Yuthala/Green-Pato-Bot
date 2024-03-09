import React from "react";
import './Button.css';

// const Button = (props) => {
//     return (
//         <button {...props} className={'button ' + props.className}/>
//     );
// };

function Button({type, title, disable, onClick}) {
    return (
      <button className={`btn ${
          (type === 'add' && 'add') || 
          (type === 'remove' && 'remove') || 
          (type === 'checkout' && 'checkout')
      }`}
          disable={disable}
          onClick={onClick}
      >
          {title}
      </button>
    )
  }

export default Button;