import IPost from '../interfaces/IPost';
import toastMsg, { ToastType } from '../utils/toastMsg';
import HttpClient from './httpClient';

interface PostsReturn {
  data: IPost[];
  previous: number | null;
  next: number | null;
  total: number;
}

class PostService {
  private static baseUrl = '/post';

  private static toastError = (msg: string): void => {
    toastMsg(ToastType.Error, msg);
  };

  static async getPost(id: string): Promise<IPost> {
    return HttpClient.api
      .get(`${this.baseUrl}/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 404) {
          this.toastError('Publicação não encontrada.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async getPosts(page: number, take: number): Promise<PostsReturn> {
    return HttpClient.api
      .get(`${this.baseUrl}?page=${page}&take=${take}`)
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 404) {
          this.toastError('Publicações não encontradas.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async getCategoryPosts(categoryId: string): Promise<IPost[]> {
    return HttpClient.api
      .get(`${this.baseUrl}/category/${categoryId}`)
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 404) {
          this.toastError('Publicações não encontradas.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async getUserPosts(userId: string): Promise<IPost[]> {
    return HttpClient.api
      .get(`${this.baseUrl}/user/${userId}`)
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 404) {
          this.toastError('Publicações não encontradas.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async publishPost(title: string, description: string, categoryId: string): Promise<IPost> {
    return HttpClient.api
      .post(this.baseUrl, {
        title,
        description,
        likes: 0,
        category: categoryId,
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 422) {
          this.toastError('Houve um problema com o os dados. Confira se os campos estão preenchidos corretamente.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async updatePost(id: string, title: string, description: string, category: string): Promise<void> {
    await HttpClient.api.put(`${this.baseUrl}/${id}`, { title, description, category }).catch((error) => {
      if (error.code === 422) {
        this.toastError('Houve um problema com o os dados. Confira se os campos estão preenchidos corretamente.');
      } else this.toastError('Um erro inesperado aconteceu.');
    });
  }

  static async deletePost(id: string): Promise<void> {
    await HttpClient.api.delete(`${this.baseUrl}/${id}`).catch((error) => {
      if (error.code === 422) {
        this.toastError('Houve um problema ao excluir a publicação. Tente novamente mais tarde.');
      } else this.toastError('Um erro inesperado aconteceu.');
    });
  }
}

export default PostService;
