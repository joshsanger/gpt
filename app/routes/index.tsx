import {useRef, useEffect} from 'react';
import {json} from '@remix-run/node';
import {type ActionArgs} from '@remix-run/node';
import {Form, useActionData, useNavigation, Link} from '@remix-run/react';

import {Configuration, OpenAIApi} from 'openai';

// todo handle errors

export async function action({request}: ActionArgs) {
  const body = await request.formData();

  const conf = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(conf);

  const chat = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: 'You are an assistant to an ecommerce company that just released information on products that have launched in the last six months. We are calling this Editions Winter ’23. Your job is to answer questions about the products that have released. I will provide you information about the products and when asked about them, you can use the information I have provided you. Do not respond to non-product related questions, or if you do not have the information. Instead respond with "Sorry, I only know about products in the Go Global solution, try again.". Do you understand?',
      },
      {
        role: 'assistant',
        content: 'Yup! I understand. If I do not have information about the product the user asks abaout, I will respond with "Sorry, I only know about products in the Go Global solution, try again. I’m ready to hear all about our latest products. Please provide me with some information so I can help make commerce better for everyone.',
      },
      {
        role: 'user',
        content: `Great! Here is some information on our latest releases in the form of an array of objects. Please let me know you are ready to help one you are ready..
        [
          {
            title: "Translate & Adapt app",
            content: "Engage more customers with regional, seasonal, and cultural relevance by localizing your store content across markets.",
            moreInfo: [
              "Use a side-by-side editor to add, edit, and review translated content, and automatically translate up to two languages completely free.",
              "Adapt content to reflect spelling and messaging variations between markets.",
            ],
          },
          {
            title: "Tailor your product offering by market",
            content: "Control which products you publish in each market. Easily align with licensing agreements, regional regulations, and buyer expectations in different markets.",
          },
          {
            title: "Market-specific order routing and fulfillment",
            content: "Configure order routing rules to match your business needs, including routing based on the customer’s proximity and inventory availability.",
          },
          {
            title: "Introducing Markets Pro",
            content: "Grow your business globally with Markets Pro, a complete solution that offers end-to-end liability management, cost-effective cross-border shipping and fulfillment, and localization tools.",
            moreInfo: [
              "Offload international tax filing, registration, and remittance.",
              "Automatically remove items with import restrictions in each market to ensure your product catalog is compliant and buyers only see what they’re allowed to purchase in their region.",
              "Access fraud protection on every cross-border order and protect refunds from currency fluctuations with guaranteed foreign exchange."
            ],
            youtubeVideo: "rRvhTLPCa6I",
          },
          {
            title: "Affordable shipping rates and integrated partners",
            content: "Get discounted rates on the Markets Pro carrier account and recommendations for new customer rates. Let us manage your international fulfillment or work with our certified logistics partners to fulfill and deliver orders.",
          },
          {
            title: "Prepaid duties and customs documentation",
            content: "Collect duties up front to get rid of surprise fees at delivery with Delivery Duty Paid labels and customs documentation that are easy to manage from your admin.",
          },
          {
            title: "Automatically localize experiences",
            content: "While Markets’ standard features let you manually localize your store, Markets Pro automates localization. Geolocation and domain redirect automatically ensure customers shop in their local experience, using the local currency and preferred payment methods."
          },
        ]`
      },
      {
        role: 'assistant',
        content: 'Got it! I’m ready to help make commerce better for everyone and answer any questions about products released in the Editions Winter ’23.',
      },
      {
        role: 'user',
        content: 'If a product has the key "youtubeVideo" then I want you to append a youtube embed once you are done explaining the product. Use the product ID and the markup should be <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeVideo}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>. Now tell me about markets.',
      },
      {
        role: 'assistant',
        content: 'We have released a complete solution called Markets Pro that can help you grow your business globally. This solution offers end-to-end liability management, cost-effective cross-border shipping and fulfillment, and localization tools. With Markets Pro, you can offload international tax filing, registration, and remittance, and access fraud protection on every cross-border order. You can also protect refunds from currency fluctuations with guaranteed foreign exchange. Additionally, Markets Pro automatically removes items with import restrictions in each market to ensure your product catalog is compliant, and buyers only see what they’re allowed to purchase in their region. For more info, check out this video! <iframe width="560" height="315" src="https://www.youtube.com/embed/rRvhTLPCa6I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      },
      {
        role: 'user',
        content: 'Perfect. I am going to now pass you to the user shortly. The user will ask you questions. Let\'s try this one. "Tell me about fullfilment"',
      },
      {
        role: 'assistant',
        content: 'We have released a new feature called Market-specific order routing and fulfillment. You can configure order routing rules to match your business needs, including routing based on the customer’s proximity and inventory availability.',
      },
      {
        role: 'user',
        content: 'Perfect. I will pass you to the user now.',
      },
      {
        role: 'assistant',
        content: 'I\'m ready! What information are you looking for?',
      },
      {
        role: 'user',
        content: body.get('message') as string,
      },
    ],
  });

  const answer = chat.data.choices[0].message?.content;

  return {
    message: body.get('message'),
    answer,
  };
}

export default function IndexPage() {
  const data = useActionData<typeof action>();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (navigation.state === 'submitting') {
      inputRef.current.value = '';
    }
  }, [navigation.state]);



  return (
    <main className="container">
      <h1>Editions Winter ’23 (Go Global) chat</h1>
      <p>Ask a question about our Go Global solution for Winter ’23</p>
      {isSubmitting && (
        <div className="answer">
          <p>Thinking...</p>
        </div>
      )}
      {!isSubmitting && data?.answer && (
        <div className="answer">
          <p dangerouslySetInnerHTML={{__html: data.answer}} />
        </div>
      )}
      <Form method="post">
        <div className="input-wrap">
          <input ref={inputRef} type="text" name="message" placeholder="Was anything released about taxes?" minLength={2} required />
          <button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>Submit</button>
        </div>
      </Form>
    </main>
  );
}

export function ErrorBoundary({error}) {
  return (
    <main className="container">
      <h1>Oops. You broke something, way to go!</h1>
      <p className="error">{error.message}</p>
      <p>Back to <Link to="/">chat</Link></p>
    </main>
  );
}