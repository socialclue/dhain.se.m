import { createAction, createAsyncAction } from 'typesafe-actions';
import { Review } from './types';

export const fetchReview = createAsyncAction(
  'review/FETCH_REQUEST',
  'review/FETCH_SUCCESS',
  'review/FETCH_FAILURE'
)<void, Review[], Error>();

export const updateReview = createAction('review/UPDATE_REVIEW', resolve =>
  () => resolve()
);

export const setSearchText = createAction('review/SET_SEARCH_TEXT', resolve =>
  (searchText: string) => resolve(searchText)
);

export const addTagFilter = createAction('review/ADD_TAG_FILTER', resolve =>
  (trackName: string) => resolve(trackName)
);

export const removeTagFilter = createAction('review/REMOVE_TAG_FILTER', resolve =>
  (trackName: string) => resolve(trackName)
);

export const updateTagFilters = createAction('review/UPDATE_TAG_FILTERS', resolve =>
  (trackNames: string[]) => resolve(trackNames)
);

export const addFavorite = createAction('review/ADD_FAVORITE', resolve =>
  (reviewId: number) => resolve(reviewId)
);

export const removeFavorite = createAction('review/REMOVE_FAVORITE', resolve =>
  (reviewId: number) => resolve(reviewId)
);

export const updateFavoriteFilter = createAction('review/UPDATE_FAVORITE_FILTER', resolve =>
  (reviewIds: number[]) => resolve(reviewIds)
);
