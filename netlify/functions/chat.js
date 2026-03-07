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
- Respond in plain text (no markdown formatting).
`;


// ================================
// GROQ API CALL
// ================================

async function callModel(message, apiKey) {

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message }
            ],
            temperature: 0.6,
            max_tokens: 200
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

        const data = await callModel(sanitizedMessage, apiKey);

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