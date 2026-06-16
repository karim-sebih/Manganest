import { useNavigate } from "react-router";

export default function CreatorRules() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Règles</h1>

            <p>
                - Pas de contenu illégal
                - Pas de plagiat
                - Respect des guidelines
            </p>

            <button onClick={() => navigate("/creator/create")}>
                J'accepte
            </button>
        </div>
    );
}
