import { useState } from "react";

const IncDecCounter = ({increaseQty}) => {
	let [num, setNum]= useState(0);
	let incNum =()=>{
	  if(num<10)
	  {
	  setNum(Number(num)+1);
	  }
	};
	{increaseQty};

	let decNum = () => {
	   if(num>0)
	   {
		setNum(num - 1);
	   }
	}
   let handleChange = (e)=>{
	 setNum(e.target.value);
	}
	 return(
	  <div className="col-xl-1">
	 	 <div className="input-group">
			<div className="input-group-prepend">
	  			<button className="btn btn-outline-primary" type="button" onClick={decNum}>-</button>
			</div>
			<input type="text" className="form-control" value={num} onChange={handleChange}/>
			<div className="input-group-prepend">
	  			<button className="btn btn-outline-primary" type="button" onClick={incNum}>+</button>
			</div>
  		</div>
  	</div>
	);
  }
  export default IncDecCounter;