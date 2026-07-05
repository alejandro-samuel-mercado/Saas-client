import { http } from "@/adapters/http";
import { BlogPost, SearchResult } from "@/types";

export const blogService = {
  getPosts: async (
    params: {
      page?: number;
      limit?: number;
      tag?: string;
      search?: string;
    } = {},
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.tag) query.append("tag", params.tag);
    if (params.search) query.append("search", params.search);

    return http<SearchResult<BlogPost>>(`/api/blog?${query.toString()}`);
  },


};
