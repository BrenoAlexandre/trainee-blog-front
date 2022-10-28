import HttpClient from './httpClient';
import { ICategory } from '../interfaces';
import toastMsg, { ToastType } from '../utils/toastMsg';

class categoryService {
  private static baseUrl = '/category';

  private static toastError = (msg: string): void => {
    toastMsg(ToastType.Error, msg);
  };

  static async getCategories(): Promise<ICategory[]> {
    return HttpClient.api
      .get(this.baseUrl)
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 404) {
          this.toastError('Nenhuma categoria foi encontrada.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async postCategory(title: string): Promise<ICategory> {
    return HttpClient.api
      .post(this.baseUrl, { title })
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 401) {
          this.toastError('Você não tem permissão para criar categorias.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async getCategory(id: string): Promise<ICategory> {
    return HttpClient.api
      .get(`${this.baseUrl}/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === 404) {
          this.toastError('A categoria não foi encontrada.');
        } else this.toastError('Um erro inesperado aconteceu.');
      });
  }

  static async updateCategory(id: string, title: string): Promise<void> {
    await HttpClient.api.put(`${this.baseUrl}/${id}`, { title }).catch((error) => {
      if (error.code === 400) {
        this.toastError('Você não pode editar uma categoria que já tenha publicações.');
      } else if (error.code === 401) {
        this.toastError('Você não tem permissão para editar categorias.');
      } else if (error.code === 404) {
        this.toastError('VoA categoria não foi encontrada.');
      } else this.toastError('Um erro inesperado aconteceu.');
    });
  }

  static async deleteCategory(id: string): Promise<void> {
    await HttpClient.api.delete(`${this.baseUrl}/${id}`).catch((error) => {
      if (error.code === 401) {
        this.toastError('Você não tem permissão para editar categorias.');
      } else if (error.code === 404) {
        this.toastError('VoA categoria não foi encontrada.');
      } else this.toastError('Um erro inesperado aconteceu.');
    });
  }
}

export default categoryService;
