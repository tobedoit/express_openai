require('dotenv').config();
const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const app = express(); // Create app object
const publicPath = path.join(__dirname, 'public'); // https://www.youtube.com/watch?v=ljVwKLLCEYg

app.use(express.static(publicPath));
// Body parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function chat(message) {
  const configuration = new Configuration({
    // apiKey: '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',
    apiKey: process.env.OPENAI_API_KEY, // https://www.youtube.com/watch?v=UQamG425RD0 (required : npm i dotenv)
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: message,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.data.choices[0].text;
}

app.post('/', async (req, res) => {
  const answer = await chat(req.body.query);
  res.json({ answer }); // 보내는건 json 형태의 객체이다 compared to res.send() method
  // res.json(answer); // answer는 스트링(답변)이다 = response.data.choices[0].text
})

// app.get('/', function(req, res) {
//   // res.send('Hello World, zmes!')
//   chat().then(result => {
//     res.send(`
//     <h1>${result}</h1>
//     `);
//   });
// });

// export your app as a function
exports.handler = async (event, context) => {
  // handle the incoming request
  const response = await app(event, context);
  return response;
};

// Listening
// app.listen(3000);