import * as review from './actions';
import { Review, ReviewState } from './types';
import { ActionType, getType } from 'typesafe-actions';
import { Middleware } from 'redux';

export const fetchReviewMiddleware: Middleware<{}, ReviewState> = ({ getState }) => next => async (action: ActionType<typeof review>) => {
  next(action);

  if (action.type != getType(review.updateReview)) {
    return;
  }

  next(review.fetchReview.request());
  try {
    const response = await fetch('/data/reviews.json');
    const fishList: Review[] = await response.json();
    next(review.fetchReview.success(fishList));
  } catch (e) {
    next(review.fetchReview.failure(e));
  }
};
