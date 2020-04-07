export function getCurrendDashboardUrl(account) {
  if (account) {
    if (account.dashboardType !== 'regular') {
      return '/onDemandDashboard';
    }
  }
  return '/';
}

