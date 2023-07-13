const mapping: Record<string, string> = {
  'github-stars': 'github_star',
  organizations: 'organization',
  repositories: 'repository',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
