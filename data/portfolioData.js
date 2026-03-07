/**
 * portfolioData.js
 * Structured portfolio data extracted from the codebase.
 * Used as context for the AI assistant backend (netlify/functions/chat.js).
 *
 * Source of truth: work.html, journey.html, index.html, contact.html, js/main.js
 * Last updated: 2026-03
 */

'use strict';

const portfolioData = {
    owner: {
        name: 'Sayan Paul',
        nickname: 'Sayan',
        initials: 'SP',
        role: 'Data Science & Machine Learning Practitioner | Python & Web Developer',
        tagline:
            'I craft intelligent, data-driven solutions by combining Python, analytics, and machine learning. I love turning raw data into meaningful insights and building models that solve real problems.',
        availability: 'Available for opportunities',
        location: 'West Bengal, India',
        openToRemote: true,
        education: {
            current: 'B.Tech in Electronics & Communication Engineering',
            institution: 'Maulana Abul Kalam Azad University of Technology (MAKAUT)',
            year: '2nd year',
            expectedGraduation: '2028',
        },
        stats: {
            repositories: 17,
            dsAndMlProjects: 7,
            webDevProjects: 5,
        },
    },

    contact: {
        email: '685sayan@gmail.com',
        linkedin: 'https://www.linkedin.com/in/sayan-paul-96531632a',
        github: 'https://github.com/Sayan1776',
        whatsapp: '+91 8101857760',
        whatsappAvailability: '11 AM – 10 PM IST',
        website: 'https://devsayan.me',
    },

    projects: [
        {
            name: 'IPL Match Outcome Predictor',
            category: 'AI / Machine Learning',
            year: '2025',
            description:
                'A machine learning system that predicts IPL match winners using ball-by-ball data, historical performance patterns, and venue stats. Features single-match predictions and full tournament simulations through a Flask-powered interface.',
            technologies: ['Python', 'Flask', 'scikit-learn', 'Pandas', 'NumPy'],
            github: 'https://github.com/Sayan1776/ipl-prediction-engine',
            demo: null,
        },
        {
            name: 'Sapling Survival Analysis System',
            category: 'AI / Computer Vision',
            year: '2026',
            description:
                'A computer vision pipeline that estimates sapling survival rates using drone-based orthomosaic imagery. Aligns pre and post-weeding surveys, detects plantation pits, classifies survival status, and outputs GIS-ready reports with visual overlays for field verification.',
            technologies: ['Python', 'OpenCV', 'Rasterio', 'NumPy', 'GIS'],
            github: 'https://github.com/Sayan1776/sapling_monitoring',
            demo: null,
        },
        {
            name: 'My Portfolio',
            category: 'Web Development',
            year: '2026',
            description:
                'A multi-page documentary-style portfolio built with vanilla HTML, CSS and JavaScript. Features a neural network skills visualization, anime.js powered entrance animations, editorial B&W design system, and a serverless contact form backend using Google Apps Script.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'anime.js'],
            github: 'https://github.com/Sayan1776/Portfolio-Sayan',
            demo: 'https://devsayan.me',
        },
        {
            name: 'SafeSpace — AI Safety Companion',
            category: 'AI / Fullstack',
            year: '2025',
            description:
                'A real-time personal safety web app built with Next.js and Groq AI. Detects threatening language in chats, monitors distress audio, suggests safe zones based on frequent locations, and sends AI-generated context-aware emergency alerts with live location data.',
            technologies: ['Next.js', 'React', 'TypeScript', 'Groq AI', 'Vercel', 'Tailwind CSS'],
            github: 'https://github.com/Debraj1001/safespace-2-0',
            demo: null,
        },
        {
            name: 'Kolkata Weather Forecast ML System',
            category: 'Machine Learning',
            year: '2025',
            description:
                'A data-driven 7-day weather forecasting model for Kolkata using Random Forest regression. Combines historical climate data with live API inputs to predict temperature and humidity accurately, visualized through interactive charts.',
            technologies: ['Python', 'NumPy', 'scikit-learn', 'Pandas'],
            github: 'https://github.com/Sayan1776/ForecastML-Kolkata',
            demo: null,
        },
        {
            name: 'Noelle — Personal AI Agent',
            category: 'AI Agent',
            year: '2025',
            description:
                'A fully local AI assistant with web browsing, file analysis, semantic search, voice I/O, and a persistent persona — built from scratch to think with you, not for you.',
            technologies: ['Python', 'Ollama', 'Playwright', 'FAISS', 'DeepSeek'],
            github: 'https://github.com/Sayan1776/Noelle',
            demo: null,
        },
    ],

    services: [
        {
            name: 'Machine Learning Solutions',
            description:
                'Designing and training ML models for prediction, classification, and automation. Experienced in scikit-learn, pandas, and building end-to-end ML workflows.',
            tags: ['Predictive Modeling', 'Python', 'ML Pipelines'],
        },
        {
            name: 'Data Analytics & Visualization',
            description:
                'Turning raw datasets into clear, actionable insights using Python, pandas, and modern visualization tools. Ideal for dashboards, reports, and data understanding.',
            tags: ['Pandas', 'Data Visualization', 'Exploratory Analysis'],
        },
        {
            name: 'Freelance Web-dev & DS/ML Projects',
            description:
                'Available for custom Web-dev & DS/ML projects. Delivering clean, production-ready solutions tailored to business goals.',
            tags: ['Custom Projects', 'Consulting', 'End-to-End Systems'],
        },
    ],

    skills: {
        expert: [
            { name: 'Python', tags: ['python'] },
            { name: 'Machine Learning / AI', tags: ['ai-ml', 'scikit-learn', 'machine learning'] },
            { name: 'Data Analysis', tags: ['pandas', 'numpy', 'data'] },
            { name: 'Generative AI', tags: ['generative ai', 'groq', 'ollama', 'deepseek', 'faiss'] },
        ],
        proficient: [
            { name: 'NumPy', tags: ['numpy'] },
            { name: 'Pandas', tags: ['pandas'] },
            { name: 'Flask', tags: ['flask'] },
            { name: 'JavaScript', tags: ['javascript'] },
            { name: 'HTML / CSS', tags: ['html', 'css'] },
            { name: 'SQL', tags: ['sql', 'plpgsql'] },
            { name: 'React / Next.js', tags: ['react', 'nextjs', 'typescript'] },
        ],
        learning: [
            { name: 'Node.js', tags: ['nodejs'] },
            { name: 'System Design', tags: ['system design'] },
            { name: 'DevOps', tags: ['vercel', 'docker', 'devops'] },
        ],
    },

    education: [
        {
            level: 'Secondary (WBBSE)',
            board: 'West Bengal Board of Secondary Education',
            year: '2022',
            highlights: ['578/700 overall — 82.57% aggregate', 'Scored 96/100 in Mathematics'],
        },
        {
            level: 'Higher Secondary (WBCHSE)',
            board: 'West Bengal Council of Higher Secondary Education',
            year: '2024',
            highlights: [
                '364/500 overall — 72.8% aggregate',
                'Scored 91/100 in English (Second Language)',
            ],
        },
        {
            level: 'B.Tech in Electronics & Communication Engineering',
            institution: 'Maulana Abul Kalam Azad University of Technology (MAKAUT)',
            duration: '2024 – 2028 (Expected)',
            year: '2028',
            highlights: [
                'Top 15% in programming and development in batch',
                'Freshers certificate at TechFest \'24 Hackathon',
            ],
        },
    ],

    certifications: [
        {
            title: 'Generative AI Mastermind Workshop',
            issuer: 'Outskill',
            year: '2025',
            date: 'May 2025',
            skills: ['AI/ML', 'Prompt Engineering'],
        },
        {
            title: '2nd Place — College Hackathon 2024',
            issuer: 'Bytestorm / GMIT',
            year: '2024',
            skills: ['Web Development', 'Hackathon', 'Teamwork'],
        },
        {
            title: 'Industrial Training in Python with Data Science',
            issuer: 'AI-Academia',
            year: '2025',
            date: 'November 2025',
            skills: ['Python', 'Data Science', 'Machine Learning'],
        },
        {
            title: 'Build with Gemini Participation Certificate',
            issuer: 'Kshitij · IIT Kharagpur',
            year: '2026',
            skills: ['Python', 'Machine Learning', 'Generative AI'],
        },
        {
            title: 'AIoT Workshop',
            issuer: 'Aspinotech Infosolutions',
            year: '2025',
            skills: ['AIoT', 'Artificial Intelligence', 'IoT'],
        },
        {
            title: 'Web 1 Industrial Internship',
            issuer: 'Web 1 · GMIT',
            year: '2025',
            skills: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
        },
        {
            title: 'Hackhazards — International Hackathon',
            issuer: 'International Hackathon',
            year: '2025',
            description:
                'Built SafeSpace — an AI-powered personal safety solution supporting students, women, the elderly, and travelers.',
            skills: ['TypeScript', 'CSS', 'JavaScript'],
        },
    ],

    leadership: [
        {
            title: 'IIC Student Council Member',
            organization: 'GMIT',
            period: '2026 – Present',
            description:
                "Representing the college at the Institution's Innovation Council, contributing to tech initiatives and student-driven innovation activities.",
        },
        {
            title: 'College Chess Tournament — Semi-finalist & Finalist',
            organization: 'GMIT',
            period: '2024 – 2025',
            description:
                'Qualified for both semi-finals and finals in the annual college chess tournament, competing against top players across all years.',
        },
        {
            title: 'Senior Mentor — Junior Orientation Sessions',
            organization: 'GMIT',
            period: '2025',
            description:
                'Organised and led multiple engaging orientation sessions for 1st year students as part of a senior team.',
        },
        {
            title: 'Organising Team — SIH 2025 Internal Round',
            organization: 'GMIT',
            period: '2025',
            description:
                "Part of the core organising team for the college's internal Smart India Hackathon 2025 selection round.",
        },
        {
            title: 'Hackathon Organiser — Inter-Year Competition',
            organization: 'GMIT',
            period: '2025',
            description:
                'Co-organised a full hackathon for 1st and 2nd year students — handled event planning, problem statements, judging, and execution.',
        },
        {
            title: 'Dev Guide — Junior Developer Mentorship',
            organization: 'GMIT',
            period: '2025',
            description:
                'Conducted structured guide sessions helping juniors start their development journey, providing one-on-one support.',
        },
    ],
};

module.exports = { portfolioData };
