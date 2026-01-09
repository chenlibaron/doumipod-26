import { GoogleGenAI, Type, Chat, Modality, GenerateContentResponse } from "@google/genai";
import { config } from '../config';
import { spotsData } from '../data/subwayData';
import { ImagePart, LearningModule, DialogueScript, Spot, ExploreCategory } from '../types';

// Lazy initialization for the GoogleGenAI client
let ai: GoogleGenAI | null = null;

/**
 * Gets the singleton instance of the GoogleGenAI client.
 * Initializes the client on the first call.
 * @throws {Error} if the API_KEY environment variable is not set.
 * @returns {GoogleGenAI} The initialized GoogleGenAI client.
 */
const getAI = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const model = config.gemini.model;

export const generateTOPIKQuestions = async (level: 'I' | 'II') => {
    const prompt = `Generate 5 TOPIK ${level} level practice questions. Include a passage if necessary. Provide questions, 4 options, the correct answer, and a brief explanation for each.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        passage_korean: { type: Type.STRING },
                        passage_english: { type: Type.STRING },
                        question: { type: Type.STRING },
                        options: {
                            type: Type.OBJECT,
                            properties: {
                                '①': { type: Type.STRING },
                                '②': { type: Type.STRING },
                                '③': { type: Type.STRING },
                                '④': { type: Type.STRING },
                            },
                            required: ['①', '②', '③', '④']
                        },
                        answer: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                    },
                    required: ['question', 'options', 'answer', 'explanation']
                }
            }
        }
    });
    return JSON.parse(response.text?.trim() || '[]');
};

export const rewriteText = async (text: string) => {
    const prompt = `Rewrite the following Korean text to be more natural and fluent. Also provide a brief explanation of the changes made.\n\nOriginal: "${text}"`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    rewrittenText: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ['rewrittenText', 'explanation']
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generatePhotoCaption = async (images: ImagePart[]) => {
    const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [...images, { text: "Generate a short, engaging caption for this image in both Korean and English. Format as JSON with 'korean' and 'english' keys." }] },
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateVideoCaption = async () => {
    const prompt = `Generate a creative video caption about a daily life vlog in Seoul, in both Korean and English. Also suggest 3 relevant hashtags. Format as JSON with 'caption_korean', 'caption_english', and 'hashtags' keys.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    caption_korean: { type: Type.STRING },
                    caption_english: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['caption_korean', 'caption_english', 'hashtags']
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateMoreModules = async (level: 'Beginner' | 'Intermediate' | 'Advanced', currentPath: LearningModule[]) => {
    const prompt = `Given the existing learning path for a ${level} Korean learner, generate 2 more sequential learning modules. Existing path: ${JSON.stringify(currentPath.map(m => m.module_title))}. For each step in the new modules, the 'type' property must be one of the following exact strings: 'grammar', 'vocabulary', 'dialogue', 'article', 'reading_practice', 'hangul_vowel', 'hangul_consonant', 'hangul_batchim', 'pronunciation_rule'.`;
    const response = await getAI().models.generateContent({
        model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: {
            type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                module_title: { type: Type.STRING }, module_description: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                    type: { type: Type.STRING }, topic: { type: Type.STRING }, title: { type: Type.STRING }, level: { type: Type.STRING }
                }, required: ['type', 'topic', 'title', 'level'] } }
            }, required: ['module_title', 'module_description', 'steps'] }
        } }
    });
    return JSON.parse(response.text?.trim() || '[]');
};

export const generateGrammarExplanation = async (grammarPoint: string) => {
    const prompt = `Explain the Korean grammar point "${grammarPoint}" in detail for learners. Provide explanations in Korean, English, and Burmese, construction rules, usage notes, common mistakes, politeness level, and example sentences.`;
    const response = await getAI().models.generateContent({
        model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: {
            type: Type.OBJECT, properties: {
                title: { type: Type.STRING }, explanation_korean: { type: Type.STRING }, explanation_english: { type: Type.STRING }, explanation_burmese: { type: Type.STRING },
                construction_rules_english: { type: Type.STRING }, construction_rules_burmese: { type: Type.STRING },
                usage_notes_english: { type: Type.STRING }, usage_notes_burmese: { type: Type.STRING },
                common_mistakes_english: { type: Type.STRING }, common_mistakes_burmese: { type: Type.STRING },
                politeness_level_english: { type: Type.STRING }, politeness_level_burmese: { type: Type.STRING },
                example_sentences: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                    korean: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING }
                }, required: ['korean', 'english', 'burmese'] } }
            }, required: ['title', 'explanation_korean', 'explanation_english', 'explanation_burmese', 'construction_rules_english', 'construction_rules_burmese', 'usage_notes_english', 'usage_notes_burmese', 'common_mistakes_english', 'common_mistakes_burmese', 'politeness_level_english', 'politeness_level_burmese', 'example_sentences']
        } }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateVocabulary = async (topic: string) => {
    const prompt = `Generate a list of 10 Korean vocabulary words related to the topic "${topic}". For each word, provide hangul, english, burmese, and an example sentence in all three languages.`;
    const response = await getAI().models.generateContent({
        model, contents: prompt, config: { responseMimeType: "application/json", responseSchema: {
            type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                hangul: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING },
                example_korean: { type: Type.STRING }, example_english: { type: Type.STRING }, example_burmese: { type: Type.STRING }
            }, required: ['hangul', 'english', 'burmese', 'example_korean', 'example_english', 'example_burmese'] }
        } }
    });
    return JSON.parse(response.text?.trim() || '[]');
};

export const generateDialogue = async (topic: string) => {
    const prompt = `
    Generate a Korean dialogue for language learners on a topic related to "${topic}". The dialogue should be natural and long enough to last about 90 seconds when spoken (around 10-15 turns between speakers).
    It should feature various people and nuances, not just a teacher and student.
    If the topic is too abstract or difficult for a dialogue, create a dialogue on a more general, related theme.

    - The dialogue must involve two speakers: one male and one female.
    - The male speaker must be named "Ji-woo" and be assigned the 'Puck' (male) voice.
    - The female speaker must be named "Yu-jin" and be assigned the 'Kore' (female) voice.
    - For each line of Korean text, analyze the context and prepend a suitable emotional or tonal nuance instruction for a text-to-speech engine (e.g., "Say cheerfully: ", "Say with curiosity: ", "Say apologetically: "). The emotion should be varied and appropriate for the content of the line.
    
    The response must be a JSON object.
    ABSOLUTE CRITICAL INSTRUCTION: The entire response, including all translations, must ONLY contain Korean, English, and Burmese languages. Under no circumstances should any other language (such as Thai, Arabic, Hindi, etc.) be included in the output. All fields with 'burmese' in their name must strictly and exclusively contain valid Burmese script. This is a hard requirement.
    
    Provide:
    - "title": A title for the dialogue.
    - "speakers": An array of two objects, each with the speaker's "name" and their assigned "voice".
    - "dialogue": An array of dialogue lines, each object having "speaker", "korean", "english", and "burmese" translations.
    `;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    speakers: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                voice: { type: Type.STRING }
                            },
                            required: ["name", "voice"]
                        }
                    },
                    dialogue: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                speaker: { type: Type.STRING },
                                korean: { type: Type.STRING },
                                english: { type: Type.STRING },
                                burmese: { type: Type.STRING }
                            },
                            required: ["speaker", "korean", "english", "burmese"]
                        }
                    }
                },
                required: ["title", "speakers", "dialogue"]
            }
        }
    });
    
    const script = JSON.parse(response.text?.trim() || '{}');

    // Manually enforce the correct voice for each speaker to ensure consistency.
    if (script.speakers) {
        script.speakers.forEach((speaker: { name: string, voice: string }) => {
            if (speaker.name === 'Ji-woo') {
                speaker.voice = 'Puck'; // Male
            } else if (speaker.name === 'Yu-jin') {
                speaker.voice = 'Kore'; // Female
            }
        });
    }

    return script;
};

export const generateDialogueAudio = async (script: DialogueScript) => {
    const speakerA = script.speakers.find(s => s.name === 'Ji-woo');
    const speakerB = script.speakers.find(s => s.name === 'Yu-jin');

    if (!speakerA || !speakerB) {
        throw new Error("Dialogue script must contain 'Ji-woo' and 'Yu-jin' speakers.");
    }

    const prompt = `TTS the following conversation between ${speakerA.name} and ${speakerB.name}:\n` + script.dialogue
        .map(line => `${line.speaker}: ${line.korean}`)
        .join('\n');

    const speakerVoiceConfigs = [
        {
            speaker: speakerA.name,
            voiceConfig: { prebuiltVoiceConfig: { voiceName: speakerA.voice } }
        },
        {
            speaker: speakerB.name,
            voiceConfig: { prebuiltVoiceConfig: { voiceName: speakerB.voice } }
        }
    ];

    const response = await getAI().models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: speakerVoiceConfigs
                }
            }
        }
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    const base64Audio = audioPart?.inlineData?.data;

    if (!base64Audio) {
        console.error("Gemini multi-speaker TTS Response Error:", JSON.stringify(response, null, 2));
        throw new Error("No audio data received from Gemini API.");
    }
    return base64Audio;
};

export const generateSingleSpeakerAudio = async (text: string) => {
    let prompt = text.trim();
    if (!prompt) {
        throw new Error("Input text for TTS cannot be empty.");
    }

    const response = await getAI().models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    const base64Audio = audioPart?.inlineData?.data;

    if (!base64Audio) {
        console.error("Gemini single-speaker TTS Response Error:", JSON.stringify(response, null, 2));
        throw new Error("No audio data received from Gemini API for single speaker audio.");
    }
    return base64Audio;
};

export const generateSingleWordAudio = async (word: string) => {
    let prompt = word.trim();
    if (!prompt) {
        throw new Error("Input text for TTS cannot be empty.");
    }
    // Repeat the word to give the model more context, improving reliability for short inputs.
    prompt = `${prompt}, ${prompt}`;

    return await generateSingleSpeakerAudio(prompt);
};


export const startAITutorChat = (): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: config.gemini.model,
        config: {
            systemInstruction: "You are a friendly and helpful AI Korean language tutor. Your name is 'AskDomi'. Your goal is to help users learn Korean in a fun and engaging way. Keep your responses concise, encouraging, and easy to understand. Use emojis to make the conversation more friendly. When explaining grammar, provide simple examples. When teaching vocabulary, provide context.",
        }
    });
};

export const generateReadingContent = async (topic: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    const prompt = `Generate a short Korean reading passage (about 100-200 words for Intermediate/Advanced, 50-100 for Beginner) on the topic "${topic}" appropriate for a ${level} level learner. Provide a title, the Korean article, an English translation, a Burmese translation, and a list of 5 key vocabulary words from the text (hangul, english, burmese).`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    korean_article: { type: Type.STRING },
                    english_translation: { type: Type.STRING },
                    burmese_translation: { type: Type.STRING },
                    key_vocabulary: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                hangul: { type: Type.STRING },
                                english: { type: Type.STRING },
                                burmese: { type: Type.STRING },
                            },
                            required: ['hangul', 'english', 'burmese'],
                        }
                    }
                },
                required: ['title', 'korean_article', 'english_translation', 'burmese_translation', 'key_vocabulary'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateHangulLesson = async (topic: string) => {
    const prompt = `Create a Hangul lesson about "${topic}". Include a title, a simple explanation in English and Burmese, and a list of relevant characters. For each character, provide the hangul, its name, its sound, and a simple example word in Korean and English.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    explanation_burmese: { type: Type.STRING },
                    characters: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                hangul: { type: Type.STRING },
                                name: { type: Type.STRING },
                                sound: { type: Type.STRING },
                                example_word_korean: { type: Type.STRING },
                                example_word_english: { type: Type.STRING },
                            },
                            required: ['hangul', 'name', 'sound', 'example_word_korean', 'example_word_english'],
                        }
                    }
                },
                required: ['title', 'explanation', 'explanation_burmese', 'characters'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generatePronunciationRule = async (topic: string) => {
    const prompt = `Explain the Korean pronunciation rule "${topic}". Provide a title, a short rule description, a more detailed explanation (both in English and Burmese), and 3-5 clear examples. For each example, include the Korean word, its correct pronunciation, and its English meaning.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    rule_description: { type: Type.STRING },
                    rule_description_burmese: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    explanation_burmese: { type: Type.STRING },
                    examples: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                korean: { type: Type.STRING },
                                pronunciation: { type: Type.STRING },
                                english: { type: Type.STRING },
                            },
                            required: ['korean', 'pronunciation', 'english'],
                        }
                    }
                },
                required: ['title', 'rule_description', 'rule_description_burmese', 'explanation', 'examples'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateProverbFlashcard = async (proverb: string) => {
    const prompt = `Generate a detailed flashcard for the Korean proverb "${proverb}". Include the literal English translation, a clear explanation in both English and Burmese, a short example dialogue between 'Ji-woo' and 'Min-jun' using the proverb, usage notes in English and Burmese, a list of key vocabulary words (hangul, english, burmese), and a creative image prompt that visually represents the proverb's meaning.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    proverb_korean: { type: Type.STRING },
                    proverb_english_literal: { type: Type.STRING },
                    explanation_english: { type: Type.STRING },
                    explanation_burmese: { type: Type.STRING },
                    dialogue: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { speaker: { type: Type.STRING }, korean: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING } }, required: ['speaker', 'korean', 'english', 'burmese'] } },
                    usage_notes: { type: Type.STRING },
                    usage_notes_burmese: { type: Type.STRING },
                    vocabulary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { hangul: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING } }, required: ['hangul', 'english', 'burmese'] } },
                    image_prompt: { type: Type.STRING },
                },
                required: ['proverb_korean', 'proverb_english_literal', 'explanation_english', 'explanation_burmese', 'dialogue', 'usage_notes', 'usage_notes_burmese', 'vocabulary', 'image_prompt'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
    }
    throw new Error("No image generated from prompt.");
};

export const generateProverbImage = generateImageFromPrompt;
export const generateExpressionImage = generateImageFromPrompt;

export const generateIdiomFlashcard = async (idiom: string) => {
    const prompt = `Generate a detailed flashcard for the Korean idiom "${idiom}". Include the literal English translation, a clear explanation in both English and Burmese, a short example dialogue between 'Ji-woo' and 'Min-jun' using the idiom, usage notes in English and Burmese, a list of key vocabulary words (hangul, english, burmese), and a creative image prompt that visually represents the idiom's meaning.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    idiom_korean: { type: Type.STRING },
                    idiom_english_literal: { type: Type.STRING },
                    explanation_english: { type: Type.STRING },
                    explanation_burmese: { type: Type.STRING },
                    dialogue: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { speaker: { type: Type.STRING }, korean: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING } }, required: ['speaker', 'korean', 'english', 'burmese'] } },
                    usage_notes: { type: Type.STRING },
                    usage_notes_burmese: { type: Type.STRING },
                    vocabulary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { hangul: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING } }, required: ['hangul', 'english', 'burmese'] } },
                    image_prompt: { type: Type.STRING },
                },
                required: ['idiom_korean', 'idiom_english_literal', 'explanation_english', 'explanation_burmese', 'dialogue', 'usage_notes', 'usage_notes_burmese', 'vocabulary', 'image_prompt'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const fetchDictionaryEntry = async (word: string) => {
    const prompt = `Provide a detailed dictionary entry for the Korean word: "${word}". Include Korean phonetic pronunciation (in Hangul, inside square brackets like [발음]). This pronunciation MUST strictly follow standard Korean phonological rules (e.g., liaison, nasalization, palatalization, aspiration). For example, the pronunciation of '꽃향기' is '[꼬턍기]'. Also include romanized pronunciation, part of speech, definitions in English and Burmese, 3-5 example sentences with translations, and full conjugation if it is a verb or adjective. The response must be a JSON object.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    hangul: { type: Type.STRING },
                    korean_pronunciation: { type: Type.STRING },
                    pronunciation: { type: Type.STRING },
                    part_of_speech: { type: Type.STRING },
                    definition_english: { type: Type.STRING },
                    definition_burmese: { type: Type.STRING },
                    example_sentences: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { korean: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING } }, required: ['korean', 'english', 'burmese'] } },
                    conjugation: {
                        type: Type.OBJECT,
                        properties: {
                            declarative: { type: Type.ARRAY, items: { type: Type.STRING } },
                            interrogative: { type: Type.ARRAY, items: { type: Type.STRING } },
                            exclamative: { type: Type.ARRAY, items: { type: Type.STRING } },
                            noun_form: { type: Type.ARRAY, items: { type: Type.STRING } },
                            adnominal: { type: Type.ARRAY, items: { type: Type.STRING } },
                            adverb_form: { type: Type.ARRAY, items: { type: Type.STRING } },
                            conjunctive: { type: Type.ARRAY, items: { type: Type.STRING } },
                            imperative: { type: Type.ARRAY, items: { type: Type.STRING } },
                            suggestive: { type: Type.ARRAY, items: { type: Type.STRING } },
                        }
                    }
                },
                required: ['hangul', 'korean_pronunciation', 'pronunciation', 'part_of_speech', 'definition_english', 'definition_burmese', 'example_sentences'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateExpressionExplanation = async (expression: string, description: string) => {
    const prompt = `Generate a detailed explanation for the Korean expression "${expression}", which means "${description}". Provide a clear explanation in both English and Burmese, 3 distinct example sentences (with Korean, English, and Burmese translations), and a creative image prompt that visually represents the expression's meaning.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    expression_korean: { type: Type.STRING },
                    explanation_english: { type: Type.STRING },
                    explanation_burmese: { type: Type.STRING },
                    example_sentences: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { korean: { type: Type.STRING }, english: { type: Type.STRING }, burmese: { type: Type.STRING } }, required: ['korean', 'english', 'burmese'] } },
                    image_prompt: { type: Type.STRING },
                },
                required: ['expression_korean', 'explanation_english', 'explanation_burmese', 'example_sentences', 'image_prompt'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateSpotsForStation = async (stationName: string) => {
    const localSpots = spotsData[stationName];
    if (localSpots) {
        const emojiMap: Record<string, string> = {
            culture: '🎭', photo: '📸', cafe: '☕️', 'daily-news': '🗞️', shopping: '🛍️',
            experience: '✨', craft: '🎨', landmark: '🗼', activity: '🚶‍♀️', dessert: '🍰',
            food: '🍜', green: '🌿', active: '⚾️', vintage: '🕰️', unique: '💡', local: '🏘️',
            romantic: '💕', professional: '💼', modern: '🏢', youth: '🧑‍🎓', quiet: '🤫',
            youthful: '🧢', aesthetic: '🖼️', idol: '🎤', luxury: '💎', business: '📈',
            innovative: '🚀', energetic: '⚡️', buzzing: '🐝'
        };
        const spotsWithEmojis = localSpots.map(spot => ({ ...spot, emoji: emojiMap[spot.category] || '📍' }));
        return Promise.resolve(spotsWithEmojis);
    }
    const prompt = `Generate 4 diverse and interesting spots to visit near "${stationName}" station in Seoul. For each spot, provide a spot_name, a category (culture, photo, cafe, shopping, experience, craft, landmark, activity, dessert, food), a short_reason (in English), a vibe_tag (one word, e.g., 'trendy', 'cozy', 'historic'), and a single relevant emoji.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { spot_name: { type: Type.STRING }, category: { type: Type.STRING }, short_reason: { type: Type.STRING }, vibe_tag: { type: Type.STRING }, emoji: { type: Type.STRING } }, required: ['spot_name', 'category', 'short_reason', 'vibe_tag', 'emoji'] } } }
    });
    return JSON.parse(response.text?.trim() || '[]');
};

export const generateExploreContent = async (spot: Spot, category: ExploreCategory) => {
    let prompt: string;
    let response: GenerateContentResponse;

    const defaultConfig: any = {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                paragraphs: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            korean: { type: Type.STRING },
                            english: { type: Type.STRING },
                            burmese: { type: Type.STRING },
                        },
                        required: ["korean", "english", "burmese"]
                    }
                },
            },
            required: ["title", "paragraphs"]
        }
    };
    
    if (category.id === 'news') {
        const topicFinderPrompt = `Using Google Search, find one interesting and very recent (today or in the last few days) news headline or event happening around "${spot.spot_name}" in Seoul. Return only the headline or a very short summary of the event as a single, concise string. Do not add any extra text or formatting.`;
        
        const topicResponse = await getAI().models.generateContent({
            model,
            contents: topicFinderPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const newsTopic = topicResponse.text?.trim();
        if (!newsTopic) {
            throw new Error("Could not find a recent news topic for this location.");
        }

        prompt = `You are a local news reporter for a Korean-learning app. Based on the news topic "${newsTopic}", provide a short, engaging news summary. The content should be light and suitable for a language learner. Include Korean phrases with English and Burmese translations.
        
        Provide the response as a JSON object with:
        - title: A catchy news headline based on the topic.
        - paragraphs: An array of objects, each containing "korean", "english", and "burmese" content. Each object is a short card-style paragraph.`;
        
        response = await getAI().models.generateContent({
            model,
            contents: prompt,
            config: defaultConfig,
        });

    } else {
        prompt = `You are an AI engine for a Korean-learning app. Generate detailed "Explore" content for the spot "${spot.spot_name}" under the category "${category.title}".
        The content should focus on real cultural/local feeling, be light, playful, and scroll-friendly.
        Include Korean phrases with English and Burmese translations where useful.

        Provide the response as a JSON object with:
        - title: A creative title combining the spot and category.
        - paragraphs: An array of objects, each containing "korean", "english", and "burmese" content. Each object is a short card-style paragraph.
        `;
        
        response = await getAI().models.generateContent({
            model,
            contents: prompt,
            config: defaultConfig
        });
    }
    
    return JSON.parse(response.text?.trim() || '{}');
};

export const generateQuizForSpot = async (spot: Spot, stationName: string) => {
    const prompt = `Generate 3 multiple-choice quiz questions related to the spot "${spot.spot_name}" near "${stationName}" station. The quizzes should be fun and educational, related to Korean language or culture. For each quiz, provide an id, type ('mcq'), topic, caption, question, 4 choices (A, B, C, D), the correct answer key (e.g., 'A'), and a focus object with relevant vocabulary and grammar points. The difficulty should be 'TOPIK 1' or 'TOPIK 2'.`;
    const response = await getAI().models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    quiz_cards: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING }, type: { type: Type.STRING }, topic: { type: Type.STRING }, caption: { type: Type.STRING }, question: { type: Type.STRING },
                                choices: { type: Type.OBJECT, properties: { A: { type: Type.STRING }, B: { type: Type.STRING }, C: { type: Type.STRING }, D: { type: Type.STRING } }, required: ['A', 'B', 'C', 'D'] },
                                correct: { type: Type.STRING }, difficulty: { type: Type.STRING },
                                focus: { type: Type.OBJECT, properties: { vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } }, grammar: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['vocabulary', 'grammar'] }
                            },
                            required: ['id', 'type', 'topic', 'caption', 'question', 'choices', 'correct', 'difficulty', 'focus'],
                        }
                    }
                },
                required: ['quiz_cards'],
            }
        }
    });
    return JSON.parse(response.text?.trim() || '{"quiz_cards":[]}');
};

export const generateStationAudio = async (stationName: string) => {
    const prompt = `Generate a realistic subway announcement for arriving at "${stationName}" station on Seoul Subway Line 2. The announcement should be in a standard female announcer voice. Include the phrase "이번 역은 ${stationName}, ${stationName}역입니다. 내리실 문은 오른쪽입니다." (This stop is ${stationName}, ${stationName} station. The doors are on your right.)`;
    const response = await getAI().models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    const base64Audio = audioPart?.inlineData?.data;

    if (!base64Audio) { 
        console.error("Gemini station TTS Response Error:", JSON.stringify(response, null, 2));
        throw new Error("No audio data received for station announcement."); 
    }
    return { station_audio: { audio_base64: base64Audio } };
};

export const generateRealisticLocationImage = async (spotName: string): Promise<string> => {
    const prompt = `Generate a realistic, photorealistic image of ${spotName} in Seoul. Capture the atmosphere and feeling of being there. Show the daily life and scenery of the area.`;
    const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
            imageConfig: {
                aspectRatio: '16:9'
            }
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("Image generation failed: no image data found in response.");
};