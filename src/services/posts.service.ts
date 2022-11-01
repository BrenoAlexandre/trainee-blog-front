import IPost from '../interfaces/IPost';
import HttpClient from './httpClient';

interface PostsReturn {
  data: IPost[];
  previous: number | null;
  next: number | null;
  total: number;
}

class PostService {
  private static baseUrl = '/post';

  static async getPost(id: string): Promise<IPost> {
    return HttpClient.api.get(`${this.baseUrl}/${id}`).then((response) => response.data);
  }

  static async getPosts(page: number, take: number): Promise<PostsReturn> {
    return HttpClient.api.get(`${this.baseUrl}?page=${page}&take=${take}`).then((response) => response.data);
  }

  static async getCategoryPosts(categoryId: string): Promise<IPost[]> {
    return HttpClient.api.get(`${this.baseUrl}/category/${categoryId}`).then((response) => response.data);
  }

  static async getUserPosts(userId: string): Promise<IPost[]> {
    return HttpClient.api.get(`${this.baseUrl}/user/${userId}`).then((response) => response.data);
  }

  static async publishPost(title: string, description: string, categoryId: string): Promise<IPost> {
    return HttpClient.api
      .post(this.baseUrl, {
        title,
        description,
        likes: 0,
        category: categoryId,
      })
      .then((response) => response.data);
  }

  static async updatePost(id: string, title: string, description: string, category: string): Promise<void> {
    await HttpClient.api.put(`${this.baseUrl}/${id}`, { title, description, category });
  }

  static async deletePost(id: string): Promise<void> {
    await HttpClient.api.delete(`${this.baseUrl}/${id}`);
  }
}

export default PostService;
