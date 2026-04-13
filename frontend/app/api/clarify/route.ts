import { NextResponse } from "next/server";

export async function POST(req: Request) {

const { input } = await req.json();

if (!input) {
return NextResponse.json(
{ error: "Missing input" },
{ status: 400 }
);
}

const prompt = `
You are an analytical clarity system.

Analyze the user's situation and separate:

1. observable facts
2. possible interpretations
3. unknown elements
4. structural conditions influencing perception
5. orientation that reduces premature conclusion
6. a clarifying question if useful

Return JSON only.

Format:

{
"observable": [],
"interpretive": [],
"unknown": [],
"structural": [],
"orientation": "",
"question": ""
}

User situation:
${input}
`;

const response = await fetch(
"https://api.openai.com/v1/chat/completions",
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "user",
content: prompt
}
],
temperature: 0.2
})
}
);

const data = await response.json();

const text = data.choices?.[0]?.message?.content;

try {

```
const parsed = JSON.parse(text);

return NextResponse.json(parsed);
```

} catch {

```
return NextResponse.json({
  observable: [],
  interpretive: [],
  unknown: [],
  structural: [],
  orientation:
    "The system was unable to fully structure the response.",
  question:
    "What aspect of the situation feels most unclear?"
});
```

}

}
