// THIS FILE IS GENERATED BY CODE GENERATOR. DO NOT CHANGE MANUALLY.
/* tslint:disable */
/* eslint-disable */
import { APIRequest } from "./types";
import * as operations from "./gen-ts";

export class listPets implements APIRequest<operations.listPetsResponse> {
  response: operations.listPetsResponse;
  method = "GET" as const;
  path: string;
  params: operations.listPetsRequest;

  constructor(args: { params: operations.listPetsRequest }) {
    this.params = args.params;
    this.path = `/pets`;
  }
}

export class createPets implements APIRequest<operations.createPetsResponse> {
  response: operations.createPetsResponse;
  method = "POST" as const;
  path: string;

  constructor() {
    this.path = `/pets`;
  }
}

export class showPetById implements APIRequest<operations.showPetByIdResponse> {
  response: operations.showPetByIdResponse;
  method = "GET" as const;
  path: string;

  constructor(args: { pathParameter: operations.showPetByIdPathParameter }) {
    this.path = `/pets/${args.pathParameter.petId}`;
  }
}
