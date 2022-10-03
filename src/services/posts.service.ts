import HttpClient from './httpClient';

interface IPost {
  title: string;
  description: string;
  likes: number;
  category: any;
  owner: any;
}
// TODO Update na interface

class PostService {
  static async getPost(id: string): Promise<IPost> {
    const { data } = await HttpClient.api.get(`api/v1/post/${id}`);
    return data;
  }

  static async getPosts(): Promise<IPost[]> {
    const { data } = await HttpClient.api.get(`api/v1/post`);
    return data;
  }

  static async getMyPosts(): Promise<IPost[]> {
    const { data } = await HttpClient.api.get(`api/v1/post/myPosts`);
    return data;
  }

  static async publishPost(title: string, description: string, categoryId: string): Promise<IPost> {
    const { data } = await HttpClient.api.post(`api/v1/post`, {
      title,
      description,
      category: categoryId,
    });
    return data;
  }

  static async updatePost(id: string, title: string, description: string): Promise<void> {
    await HttpClient.api.patch(`api/v1/post/${id}`, { title, description });
  }

  static async deletePost(id: string): Promise<void> {
    await HttpClient.api.delete(`api/v1/post/${id}`);
  }
}

export default PostService;
