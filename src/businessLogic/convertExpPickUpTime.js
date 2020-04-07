export function ConvertExpPickUpTime(val) {
	return val.split('-')[1];
}

export function SetCorrectDeliveryTime(val) {
	val = parseInt(val) + 1;
	if(val <= 9)
		return '0'+val+':00';
	if(val >= 10)
		return val+':00';
}
