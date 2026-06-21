import Manga from "../../models/Manga.js";

async function GetPendingManga(req, res) {
    try {
        const mangas = await Manga.findAll({
            where: { status: "pending" },
            order: [["created_at", "DESC"]]
        });

        res.json(mangas);
    } catch (err) {
        res.status(500).json({ message: "Erreur fetch pending manga" });
    }
}

async function ApproveManga(req, res) {
    try {
        const { id } = req.params;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Not found" });
        }

        await manga.update({ status: "approved" });

        res.json({ message: "Manga approuvé ✅" });
    } catch (err) {
        res.status(500).json({ message: "Erreur approve" });
    }
}

async function RejectManga(req, res) {
    try {
        const { id } = req.params;

        const manga = await Manga.findByPk(id);

        if (!manga) {
            return res.status(404).json({ message: "Not found" });
        }

        await manga.update({ status: "rejected" });

        res.json({ message: "Manga rejeté ❌" });
    } catch (err) {
        res.status(500).json({ message: "Erreur reject" });
    }
}

export { GetPendingManga, ApproveManga, RejectManga };