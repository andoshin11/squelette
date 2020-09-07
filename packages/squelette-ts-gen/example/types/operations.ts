// THIS FILE IS GENERATED BY CODE GENERATOR. DO NOT CHANGE MANUALLY.
/* tslint:disable */
/* eslint-disable */
import Pet from "./models/Pet";
import Pets from "./models/Pets";
import Error from "./models/Error";

export interface listPetsRequest {
  limit?: number;
}

export type listPetsResponse = Pets;

export interface listPetsPathParameter {}

export interface createPetsRequest {}

export interface createPetsResponse {
  pet: Pet;
}

export interface createPetsPathParameter {}

export interface createPets422Error {
  reason: string;
}

export interface showPetByIdRequest {}

export type showPetByIdResponse = Pets;

export interface showPetByIdPathParameter {
  petId: string;
}