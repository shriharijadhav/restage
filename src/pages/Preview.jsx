import { useParams } from 'react-router-dom';

export default function Preview() {
  const { id } = useParams();
  return <h1 className="text-xl">Preview Blog ID: {id}</h1>;
}
