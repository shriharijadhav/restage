import { useParams } from 'react-router-dom';

export default function BlogDetail() {
  const { id } = useParams();
  return <h1 className="text-xl">Viewing Blog ID: {id}</h1>;
}
