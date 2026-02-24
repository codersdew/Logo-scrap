const axios = require('axios');

export default async function handler(req, res) {
    const { question, template = 'logical' } = req.query; // URL එකෙන් දත්ත ලබා ගැනීම

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    try {
        const { data } = await axios.post('https://chat.dphn.ai/api/chat', {
            messages: [{ role: 'user', content: question }],
            model: 'dolphinserver:24B',
            template: template
        }, {
            headers: {
                origin: 'https://chat.dphn.ai',
                referer: 'https://chat.dphn.ai/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });

        const result = data.split('\n\n')
            .filter(line => line && line.startsWith('data: {'))
            .map(line => JSON.parse(line.substring(6)))
            .map(line => line.choices[0].delta.content)
            .join('');

        res.status(200).json({ status: true, result });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}
