/*export default function filterStatOnlyDone() { 
  const groupagesOnlyDone = _(groupages).filter((groupages) => this.props.groupages.groupageStatus === 'done');

	return groupagesOnlyDone;
}*/
export default function filterStatOnlyDone(objValue, filterValue) {

	return (objValue.indexOf(filterValue) > -1);
}
