import { getSkills } from "../../lib/query";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query } = req;
        res.status(200).json(await getSkills(query));
    }
    else {
        res.status(400).json({error: 'Only GET is supported'});
    }
}