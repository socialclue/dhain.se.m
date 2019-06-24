export interface Fish {
    id: number,
    name: string,
    pic: string,
    description: string,
    branchIds: number[],
    tags: string[]
  }

  export interface FishState {
    searchText: string;
    tagFilters: string[];
    fishes: Fish[];
    favoriteFishes: number[];
  }

  export interface FishGroup {
    fishes: Fish[]
  }

  export interface FistGoingToTrip {
    id: string,
    rating: string,
    feedback: string,
    remarks: string,
    name:string,
    file:string,
    timestamp: string,
    geoLocation: string,
}
