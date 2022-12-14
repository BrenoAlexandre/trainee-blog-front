export interface IRoute {
  path: string;
  component: React.FunctionComponent;
  public: boolean;
  adminOnly: boolean;
  redirectTo: string;
}
