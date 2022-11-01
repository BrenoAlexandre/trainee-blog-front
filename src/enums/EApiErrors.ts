export const EApiErrors: { [key: string]: string } = {
  default: 'Um erro inesperado aconteceu.',
  //
  createUser_WRONG_CREDENTIALS: 'Esse email já está cadastrado na plataforma.',
  findUserById_USER_NOT_FOUND: 'Usuário não encontrado.',
  updateUser_USER_NOT_FOUND: 'Usuário não encontrado.',
  //
  getPost_POST_NOT_FOUND: 'Publicação não encontrada.',
  getPosts_POST_NOT_FOUND: 'Publicações não encontradas.',
  getCategoryPosts_POST_NOT_FOUND: 'Publicações não encontradas.',
  getUserPosts_POST_NOT_FOUND: 'Publicações não encontrada.',
  publishPost_INVALID_OPERATION:
    'Houve um problema com o os dados. Confira se os campos estão preenchidos corretamente.',
  updatePost_INVALID_OPERATION:
    'Houve um problema com o os dados. Confira se os campos estão preenchidos corretamente.',
  deletePost_INVALID_OPERATION: 'Houve um problema ao excluir a publicação. Tente novamente mais tarde.',
  //
  getCategories_CATEGORY_NOT_FOUND: 'Nenhuma categoria foi encontrada.',
  postCategory_FORBIDDEN_OPERATION: 'Você não tem permissão para criar categorias.',
  getCategory_CATEGORY_NOT_FOUND: 'A categoria não foi encontrada.',
  updateCategory_FORBIDDEN_OPERATION: 'Você não tem permissão para editar categorias.',
  updateCategory_CATEGORY_NOT_FOUND: 'A categoria não foi encontrada.',
  updateCategory_INVALID_OPERATION: 'Você não pode editar uma categoria que já tenha publicações.',
  deleteCategory_FORBIDDEN_OPERATION: 'Você não tem permissão para deletar categorias.',
  deleteCategory_CATEGORY_NOT_FOUND: 'A categoria não foi encontrada.',
};
