import { GithubStarInterface } from 'interfaces/github-star';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface RepositoryInterface {
  id?: string;
  name: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  github_star?: GithubStarInterface[];
  organization?: OrganizationInterface;
  _count?: {
    github_star?: number;
  };
}

export interface RepositoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  organization_id?: string;
}
