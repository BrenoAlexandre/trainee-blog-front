/**
 * @description
 * Retorna o token setado no localStorage.
 * @return {String} Bearer eyJhbGciOiJIUzI1NiIsInR
 */

const getTokenStorage = (): string => {
  const token = localStorage.getItem('authorization');
  return token || '';
};

export default getTokenStorage;
