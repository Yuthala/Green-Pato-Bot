const QtyField = (count) => {
	return ( 
		<input type="number" min="1" max="10" value={count}/>
	 );
}
 
export default QtyField;