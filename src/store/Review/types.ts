export interface Review {
    id: number,
    name: string,
    ratings:number,
    feedback:string,
    remarks:string
  }

  export interface ReviewState {
    searchText: string;
    tagFilters: string[];
    reviews: Review[];
    favoriteReviews: number[];
  }
