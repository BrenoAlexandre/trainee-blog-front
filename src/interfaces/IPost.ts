export default interface IPost {
  id: string;
  title: string;
  description: string;
  likes: number;
  category: { title: string };
  owner: { id: string; name: string };
}
