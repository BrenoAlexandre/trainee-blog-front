import HttpClient from './httpClient';

interface ICategory {
  title: string;
  owner: any;
}

class categoryService {
  static async getCategories(): Promise<ICategory[]> {
    const { data } = await HttpClient.api.get(`api/v1/category`);
    return data;
  }

  static async postCategory(title: string): Promise<ICategory> {
    const { data } = await HttpClient.api.post(`api/v1/category`, { title });
    return data;
  }

  static async getCategory(id: string): Promise<ICategory> {
    const { data } = await HttpClient.api.get(`api/v1/category/${id}`);
    return data;
  }

  static async updateCategory(id: string, title: string): Promise<void> {
    await HttpClient.api.put(`api/v1/category/${id}`, { title });
  }

  static async deleteCategory(id: string): Promise<void> {
    await HttpClient.api.delete(`api/v1/category/${id}`);
  }
}

export default categoryService;
