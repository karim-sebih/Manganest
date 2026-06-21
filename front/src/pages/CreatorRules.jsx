import { useNavigate } from "react-router";

export default function CreatorRules() {
    const navigate = useNavigate();

    function handleAccept() {
        localStorage.setItem("acceptedRules", "true");
        navigate("/creator/dashboard");
    }


    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Règles</h1>

            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Pas de contenu illégal</li>
                <li>Pas de plagiat</li>
                <li>Respect des guidelines</li>
            </ul>

            <button
                onClick={handleAccept}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                J'accepte
            </button>
        </div>
    );
}
