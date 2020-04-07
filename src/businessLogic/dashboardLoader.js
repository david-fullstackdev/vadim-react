
export function fleetDashLoader(type, router) {
  if(type) {
    if(type==='onDemand')
      router.replace('/onDemandDashboard');
    else
      router.replace('/fleetOwnerDashboard');
  }
}
