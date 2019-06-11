import * as reviews from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ReviewState } from './types';

const defaultState: ReviewState = {
  searchText: '',
  tagFilters: [],
  reviews: [],
  favoriteReviews: []
}

export default (state = defaultState, action: ActionType<typeof reviews>): ReviewState => {
  switch (action.type) {
  case getType(reviews.setSearchText):
    return {
      ...state,
      searchText: action.payload
    };
  case getType(reviews.addTagFilter):
    const updatedTagFilters = state.tagFilters
      .concat(action.payload)
      .reduce((updatedList, item) => {
        if (!updatedList.indexOf(item)) {
          updatedList.push(item);
        }
        return updatedList;
      }, <string[]>[]);
    return {
      ...state,
    };
  case getType(reviews.removeTagFilter):
    return {
      ...state,
      tagFilters: state.tagFilters.filter(tn => tn !== action.payload)
    };
  case getType(reviews.updateTagFilters):
    return {
      ...state,
      tagFilters: action.payload
    };
  case getType(reviews.addFavorite):
    const updatedFavoriteReviews = state.favoriteReviews.concat(action.payload).reduce((updatedList, item) => {
        if (updatedList.indexOf(item) === -1) {
          updatedList.push(item);
        }
        return updatedList;
      }, <number[]>[])
    return {
      ...state,
      favoriteReviews: updatedFavoriteReviews
    };
  case getType(reviews.removeFavorite):
    return {
      ...state,
      favoriteReviews: state.favoriteReviews.filter(fid => fid !== action.payload)
    };
  case getType(reviews.updateFavoriteFilter):
    return {
      ...state,
      favoriteReviews: action.payload
    };
  case getType(reviews.fetchReviews.success):
    return {
      ...state,
      reviews: action.payload
    }
  default:
    return state;
  }
}
