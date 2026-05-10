import { describe, expect, it } from 'vitest';
import { buildPaginationMeta, getPaginationSkipTake } from './pagination';

describe('getPaginationSkipTake', () => {
  it('computes skip/take from page-based query', () => {
    expect(getPaginationSkipTake({ page: 1, pageSize: 20 })).toEqual({ skip: 0, take: 20 });
    expect(getPaginationSkipTake({ page: 3, pageSize: 10 })).toEqual({ skip: 20, take: 10 });
  });
});

describe('buildPaginationMeta', () => {
  it('returns totalPages = 0 when there are no records', () => {
    expect(buildPaginationMeta({ page: 1, pageSize: 20 }, 0)).toEqual({
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    });
  });

  it('rounds up totalPages for partial last page', () => {
    expect(buildPaginationMeta({ page: 2, pageSize: 20 }, 25)).toEqual({
      page: 2,
      pageSize: 20,
      total: 25,
      totalPages: 2,
    });
  });

  it('returns exact totalPages when total divides evenly', () => {
    expect(buildPaginationMeta({ page: 1, pageSize: 10 }, 30)).toEqual({
      page: 1,
      pageSize: 10,
      total: 30,
      totalPages: 3,
    });
  });
});
