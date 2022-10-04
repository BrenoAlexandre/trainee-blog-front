import IPost from '../interfaces/IPost';
import HttpClient from './httpClient';

class PostService {
  static async getPost(id: string): Promise<IPost> {
    const { data } = await HttpClient.api.get(`/post/${id}`);
    return data;
  }

  static async getPosts(): Promise<IPost[]> {
    const { data } = await HttpClient.api.get(`/post`);
    return data;
  }

  static async getMyPosts(): Promise<IPost[]> {
    const { data } = await HttpClient.api.get(`/post/myPosts`);
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

  static async updatePost(id: string, title: string, description: string): Promise<void> {
    await HttpClient.api.patch(`/post/${id}`, { title, description });
  }

  static async deletePost(id: string): Promise<void> {
    await HttpClient.api.delete(`/post/${id}`);
  }
}

export default PostService;
