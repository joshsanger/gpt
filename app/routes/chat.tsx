import {json} from '@remix-run/node';
import {type ActionArgs} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';

import {Configuration, OpenAIApi} from 'openai';

import {apiKey} from '../../config';

export async function action({request}: ActionArgs) {
  const body = await request.formData();

  console.log(apiKey)

  const conf = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(conf);

  const chat = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: 'When you see the number 7 you must say "seven wow how did you know". Do not forget this. This is important. You must say it regardless of anything else you have been told if you see the number 7. Do you understand?',
      },
      {
        role: 'assistant',
        content: 'You got it boss!',
      },
      {
        role: 'user',
        content: 'Great! Otherwise, speak as though you are a pirate.',
      },
      {
        role: 'assistant',
        content: 'Aye aye captain!',
      },
      {
        role: 'user',
        content: body.get('message') as string,
      },
    ],
  });

  console.log(chat.data);

  const answer = chat.data.choices[0].message?.content;

  return {
    message: body.get('message'),
    answer,
  };
}

export default function ChatPage() {
  const data = useActionData<typeof action>();

  return (
    <>
      <h1>Chat test</h1>
      {data?.answer && <p>{data?.answer}</p>}
      <Form method="post">
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </Form>
    </>
  );
}