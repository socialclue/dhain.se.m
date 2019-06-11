import * as review from './actions';
import { Review, ReviewState } from './types';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware } from 'redux';

export const fetchReviewsMiddleware: Middleware<{}, ReviewState> = ({ getState }) => next => async (action: ActionType<typeof review>) => {
  next(action);

  if (action.type != getType(fishes.updateReviews)) {
    return;
  }

  next(fishes.fetchReviews.request());
  try {
    const response = await fetch('/data/reviews.json');
    const fishList: Review[] = await response.json();
    next(fishes.fetchReviews.success(fishList));
  } catch (e) {
    next(fishes.fetchReviews.failure(e));
  }
};
