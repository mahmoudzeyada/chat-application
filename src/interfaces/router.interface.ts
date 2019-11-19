import { Router } from "express";

export interface IRouter {
  readonly path: string;
  router: Router;
}
