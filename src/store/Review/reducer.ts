import * as review from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { ReviewState } from './types';

const defaultState: ReviewState = {
  searchText: '',
  tagFilters: [],
  review: [],
  favoriteReview: []
}

export default (state = defaultState, action: ActionType<typeof review>): ReviewState => {
  switch (action.type) {
  case getType(review.setSearchText):
    return {
      ...state,
      searchText: action.payload
    };
  case getType(review.addTagFilter):
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
  case getType(review.removeTagFilter):
    return {
      ...state,
      tagFilters: state.tagFilters.filter(tn => tn !== action.payload)
    };
  case getType(review.updateTagFilters):
    return {
      ...state,
      tagFilters: action.payload
    };
  case getType(review.addFavorite):
    const updatedFavoriteReview = state.favoriteReview.concat(action.payload).reduce((updatedList, item) => {
        if (updatedList.indexOf(item) === -1) {
          updatedList.push(item);
        }
        return updatedList;
      }, <number[]>[])
    return {
      ...state,
      favoriteReview: updatedFavoriteReview
    };
  case getType(review.removeFavorite):
    return {
      ...state,
      favoriteReview: state.favoriteReview.filter(fid => fid !== action.payload)
    };
  case getType(review.updateFavoriteFilter):
    return {
      ...state,
      favoriteReview: action.payload
    };
  case getType(review.fetchReview.success):
    return {
      ...state,
      review: action.payload
    }
  default:
    return state;
  }
}
