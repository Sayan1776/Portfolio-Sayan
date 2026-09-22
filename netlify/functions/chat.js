/**
 * Netlify Serverless Function — /api/chat
 * Handles AI chat requests for the portfolio assistant.
 */

'use strict';

const { portfolioData } = require('../../data/portfolioData');


// ================================
// SYSTEM PROMPT
// ================================

const SYSTEM_PROMPT = `You are the AI portfolio assistant for ${portfolioData.owner.name}, a ${portfolioData.owner.role}.

Your job is to answer questions about Sayan's portfolio: projects, skills, education, experience, certifications, and how to get in touch.

Keep answers concise, friendly, and helpful (2–4 sentences unless more detail is genuinely needed).

== PORTFOLIO DATA ==
${JSON.stringify(portfolioData, null, 2)}
== END PORTFOLIO DATA ==

Guidelines:
- Always prefer information from the PORTFOLIO DATA section.
- If the user asks something not present in the data, say you don't have that information.
- Answer only questions related to this portfolio and its owner.
- If asked something completely unrelated, politely redirect to portfolio topics.
- For project links, share the GitHub URL from the data when available.
- For contact, use the email or LinkedIn from the data.
- Never invent information not present in the data above.
- Format responses clearly and concisely.
- When answering about a specific project or topic, start with a short title line (e.g. "Project: IPL Winner Predictor").
- Use short paragraphs of 2–3 sentences maximum each.
- Use bullet points (starting with •) when listing items such as tech stack, skills, or features.
- Avoid large single text blocks; break content into digestible sections.
- Keep total response length concise (4–8 lines ideal).
`;


// ================================
// GROQ API CALL
// ================================


// ================================
// SUPABASE FETCH
// ================================
async function getProjectsFromSupabase() {
    try {
        const res = await fetch('https://qxgimcqpzfscflsbenyh.supabase.co/rest/v1/projects?select=*', {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4Z2ltY3FwemZzY2Zsc2JlbnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTQxNDQsImV4cCI6MjEwMDk5MDE0NH0.m32fpKuVnQt9rihu1lG3jeDJonYHyPHGHhRHmCD42lk',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4Z2ltY3FwemZzY2Zsc2JlbnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MTQxNDQsImV4cCI6MjEwMDk5MDE0NH0.m32fpKuVnQt9rihu1lG3jeDJonYHyPHGHhRHmCD42lk'
            }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error('Supabase fetch error:', e);
    }
    return portfolioData.projects; // Fallback to local data
}

async function callModel(message, apiKey, prompt) {

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: message }
            ],
            temperature: 0.6,
            max_tokens: 400
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[chat] Groq API error ${response.status}:`, errorText);
        throw new Error(`Groq returned status ${response.status}`);
    }

    return response.json();
}


// ================================
// NETLIFY FUNCTION
// ================================

exports.handler = async (event) => {

    // Fetch live projects from Supabase
    const liveProjects = await getProjectsFromSupabase();
    const dynamicPortfolioData = { ...portfolioData, projects: liveProjects };
    const DYNAMIC_SYSTEM_PROMPT = SYSTEM_PROMPT.replace(JSON.stringify(portfolioData, null, 2), JSON.stringify(dynamicPortfolioData, null, 2));


    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };


    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: corsHeaders, body: '' };
    }


    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }


    // Get API key
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error('[chat] GROQ_API_KEY not set');
        return {
            statusCode: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Chat service not configured' }),
        };
    }


    // Parse request
    let message;

    try {
        const body = JSON.parse(event.body || '{}');
        message = body.message;
    } catch {
        return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid JSON body' }),
        };
    }


    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Message is required' }),
        };
    }


    if (message.length > 500) {
        return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Message exceeds 500 character limit' }),
        };
    }


    const sanitizedMessage = message.trim();


    // ================================
    // CALL GROQ
    // ================================

    let reply;

    try {

        const data = await callModel(sanitizedMessage, apiKey, DYNAMIC_SYSTEM_PROMPT);

        reply = data.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            throw new Error('Empty response from Groq');
        }

    } catch (err) {

        console.error('[chat] Error calling Groq:', err.message);

        return {
            statusCode: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Could not get a response right now. Please try again shortly.'
            }),
        };
    }


    return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply }),
    };

};