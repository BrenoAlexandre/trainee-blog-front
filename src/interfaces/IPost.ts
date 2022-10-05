export default interface IPost {
  id: string;
  title: string;
  description: string;
  likes: number;
  created_at: Date | string;
  category: { id: string; title: string };
  owner: { id: string; name: string };
}
