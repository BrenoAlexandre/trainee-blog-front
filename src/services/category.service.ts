import HttpClient from './httpClient';
import { ICategory } from '../interfaces';

class categoryService {
  private static baseUrl = '/category';

  static async getCategories(): Promise<ICategory[]> {
    return HttpClient.api.get(this.baseUrl).then((response) => response.data);
  }

  static async postCategory(title: string): Promise<ICategory> {
    return HttpClient.api.post(this.baseUrl, { title }).then((response) => response.data);
  }

  static async getCategory(id: string): Promise<ICategory> {
    return HttpClient.api.get(`${this.baseUrl}/${id}`).then((response) => response.data);
  }

  static async updateCategory(id: string, title: string): Promise<void> {
    await HttpClient.api.put(`${this.baseUrl}/${id}`, { title });
  }

  static async deleteCategory(id: string): Promise<void> {
    await HttpClient.api.delete(`${this.baseUrl}/${id}`);
  }
}

export default categoryService;
