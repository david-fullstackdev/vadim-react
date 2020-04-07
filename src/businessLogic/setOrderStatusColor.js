export default function setOrderStatusColor(status) {
  if(!status)
    return '';
  else if(status==='created')
    return {color: 'green'}
  else if(status==='includedToGroupage')
    return {color: 'green'}
  else if(status==='delivered')
    return {color: 'green'}
  else if(status==='new')
    return {color: 'green'}
  else if(status==='returned')
    return {color: 'red'}
  else if(status==='waitingForReturn')
    return {color: 'red'}
  else if(status==='canceled')
    return {color: 'red'}
  else if(status==='onWayToDelivery')
      return {color: 'orange'}
  else if(status==='pickedUp')
    return {color: 'orange'}
  else if(status==='waitingForPickup')
    return {color: 'orange'}
  else if(status==='assigned')
    return {color: 'blue'}
}
