import { RepositoryInterface } from 'interfaces/repository';
import { GetQueryInterface } from 'interfaces';

export interface GithubStarInterface {
  id?: string;
  date: any;
  star_count: number;
  repository_id?: string;
  created_at?: any;
  updated_at?: any;

  repository?: RepositoryInterface;
  _count?: {};
}

export interface GithubStarGetQueryInterface extends GetQueryInterface {
  id?: string;
  repository_id?: string;
}
