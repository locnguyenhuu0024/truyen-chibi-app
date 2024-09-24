import { ComicTypes } from "@/utils/enums/comic.type";
import { request as requestAxios } from "./axios";
import { Category, Comic } from "@/types/comic";
import { ChapterResponse } from "@/types/chapter";
import { SignupRequest, Token } from "@/types/auth";
import { HistoriesResponse, HistorySaveRequest } from "@/types/history";
import {
  deleteUserData,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
} from "@/utils/secure.store.helper";

const LIMIT_REFRESH = 5;

class ApiService {
  private async getAccessToken(): Promise<string | null> {
    return await getAccessToken();
  }

  private async refreshToken(): Promise<string | null> {
    const newTokens = await this.refresh();
    await refreshAccessToken(newTokens);
    return await getAccessToken();
  }

  private async request(
    route: string,
    method: "GET" | "POST" = "GET",
    data?: any
  ): Promise<any> {
    let time = 0;
    let token = await this.getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const requestFunc =
      method === "GET"
        ? () => requestAxios.get(route, config)
        : () => requestAxios.post(route, data, config);

    try {
      const result = await requestFunc();
      return result.data;
    } catch (error) {
      if (token && time < LIMIT_REFRESH) {
        time += 1;
        token = await this.refreshToken();
        config.headers.Authorization = `Bearer ${token}`;
        const result = await requestFunc();
        return result.data;
      } else {
        console.log(error);
        throw new Error("Request failed after token refresh.");
      }
    }
  }

  public async getHistories(page: number): Promise<HistoriesResponse> {
    return await this.request(`/history?page=${page}`);
  }

  public async getComicsByType(
    page: number = 1,
    type: string = ComicTypes.New
  ): Promise<any> {
    return await this.request(
      `/comics?${type ? `type=${type}` : ""}${page ? `&page=${page}` : ""}`
    );
  }

  public async getHome(): Promise<any> {
    return await this.request(`/comics/home`);
  }

  public async getCategories(): Promise<Category[]> {
    return await this.request(`/comics/categories`);
  }

  public async searchComics(keyword: string): Promise<any> {
    return await this.request(`/comics/search?keyword=${keyword}`);
  }

  public async getComicBySlug(slug: string): Promise<Comic> {
    return await this.request(`/comics/${slug}`);
  }

  public async getChapterById(chapterId: string): Promise<ChapterResponse> {
    return await this.request(`/comics/chapter/${chapterId}`);
  }

  public async register(signupData: SignupRequest): Promise<any> {
    return await this.request("/auth/signup", "POST", signupData);
  }

  public async login(email: string, password: string): Promise<any> {
    return await this.request("/auth/login", "POST", { email, password });
  }

  private async refresh(): Promise<Token> {
    try {
      const refreshToken = await getRefreshToken();
      console.log("refreshToken:", refreshToken);
      const newTokens = await requestAxios.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      return newTokens.data;
    } catch (error) {
      await deleteUserData();
      throw error;
    }
  }

  public async saveHistory(
    historySaveRequest: HistorySaveRequest
  ): Promise<any> {
    return await this.request("/history/save", "POST", historySaveRequest);
  }

  public async getComicsByCategory(
    categorySlug: string,
    page: number = 1
  ): Promise<any> {
    return await this.request(
      `/comics/categories/${categorySlug}?page=${page}`
    );
  }
}

export default ApiService;
