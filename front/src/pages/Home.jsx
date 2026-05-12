import React from "react";

export default function Home() {
    return(
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-red">Bienvenue sur Manganest</h1>
            <p className="text-lg mb-6">Découvrez notre collection de mangas, partagez vos avis et trouvez votre prochaine lecture préférée !</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold mb-2">Explorez notre collection</h2>
                    <p>Parcourez notre vaste sélection de mangas, des classiques aux nouveautés, et trouvez votre prochaine lecture.</p>

                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold mb-2">Partagez vos avis</h2>
                    <p>Rejoignez notre communauté de passionnés et partagez vos avis sur vos mangas préférés.</p>
                </div>


                <div className="bg-white rounded-lg shadow-md p-4"></div>
                    <h2 className="text-xl font-bold mb-2">Trouvez votre prochaine lecture</h2>
                    <p>Utilisez nos recommandations personnalisées pour découvrir de nouveaux mangas adaptés à vos goûts.</p>
                </div>
            </div>
    
    );
}