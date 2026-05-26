import { useParams } from "react-router";

export default function Chapter() {

    const { id } = useParams();

    console.log(id);

    return (
        <div>
            Chapitre : {id}
        </div>
    );
}