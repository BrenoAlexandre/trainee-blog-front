import IPost from '../interfaces/IPost';
import HttpClient from './httpClient';

interface PostsReturn {
  data: IPost[];
  previous: number | null;
  next: number | null;
  total: number;
}

class PostService {
  static async getPost(id: string): Promise<IPost> {
    const { data } = await HttpClient.api.get(`/post/${id}`);
    return data;
  }

  static async getPosts(page: number, take: number): Promise<PostsReturn> {
    const { data } = await HttpClient.api.get(`/post?page=${page}&take=${take}`);
    return data;
  }

  static async getCategoryPosts(categoryId: string): Promise<IPost[]> {
    const { data } = await HttpClient.api.get(`/post/category/${categoryId}`);
    return data;
  }

  static async getUserPosts(userId: string): Promise<IPost[]> {
    const { data } = await HttpClient.api.get(`/post/user/${userId}`);
    return data;
  }

  static async publishPost(title: string, description: string, categoryId: string): Promise<IPost> {
    const { data } = await HttpClient.api.post(`/post`, {
      title,
      description,
      category: categoryId,
    });
    return data;
  }

  static async updatePost(id: string, title: string, description: string, category: string): Promise<void> {
    await HttpClient.api.put(`/post/${id}`, { title, description, category });
  }

  static async deletePost(id: string): Promise<void> {
    await HttpClient.api.delete(`/post/${id}`);
  }
}

export default PostService;
